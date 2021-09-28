import {
	Asset,
	AssetType,
	Binary,
	EIP712Domain,
	LegacyOrder,
	OpenSeaV1Order,
	RaribleV2Order,
} from "@rarible/protocol-api-client"
import {Address, toAddress, BigNumber, toBigNumber, toBinary, ZERO_ADDRESS} from "@rarible/types"
import {Ethereum, signTypedData} from "@rarible/ethereum-provider"
import { toBn } from "@rarible/utils"
import {
	OpenSeaOrderToSignDTO,
	OrderOpenSeaV1DataV1FeeMethod,
	OrderOpenSeaV1DataV1HowToCall,
	OrderOpenSeaV1DataV1SaleKind,
	OrderOpenSeaV1DataV1Side,
} from "../common/orders"
import {Config} from "../config/type"
import {hashLegacyOrder} from "./hash-legacy-order"
import {assetTypeToStruct} from "./asset-type-to-struct"
import {EIP712_DOMAIN_TEMPLATE, EIP712_ORDER_TYPE, EIP712_ORDER_TYPES} from "./eip712"
import {encodeData} from "./encode-data"
import { extractNftType } from "./is-nft"
import { createErc721Contract } from "./contracts/erc721"
import { createErc1155Contract } from "./contracts/erc1155"

export type SimpleLegacyOrder =
    Pick<LegacyOrder, "data" | "maker" | "taker" | "make" | "take" | "salt" | "start" | "end" | "type" | "signature">

export type SimpleRaribleV2Order =
    Pick<RaribleV2Order, "data" | "maker" | "taker" | "make" | "take" | "salt" | "start" | "end" | "type" | "signature">

export type SimpleOpenSeaV1Order =
    Pick<OpenSeaV1Order, "data" | "maker" | "taker" | "make" | "take" | "salt" | "start" | "end" | "type" | "signature">

export type SimpleOrder =
    SimpleLegacyOrder |
    SimpleRaribleV2Order |
    SimpleOpenSeaV1Order

export async function signOrder(
	ethereum: Ethereum,
	config: Pick<Config, "exchange" | "chainId">,
	order: SimpleOrder
): Promise<Binary> {
	switch (order.type) {
		case "RARIBLE_V1": {
			const legacyHash = hashLegacyOrder(ethereum, order)
			return toBinary(await ethereum.personalSign(legacyHash.substring(2)))
		}
		case "RARIBLE_V2": {
			const domain = createEIP712Domain(config.chainId, config.exchange.v2)
			const signature = await signTypedData(ethereum, {
				primaryType: EIP712_ORDER_TYPE,
				domain,
				types: EIP712_ORDER_TYPES,
				message: orderToStruct(ethereum, order),
			})
			return toBinary(signature)
		}

		default: {
			throw new Error(`Unsupported order type: ${(order as any).type}`)
		}
	}
}

function getPaymentTokenAddress(order: SimpleOrder): Address | undefined {
	const makePaymentToken = extractPaymentTokenAddress(order.make.assetType)
	if (makePaymentToken !== undefined) {
		return makePaymentToken
	}
	const takePaymentToken = extractPaymentTokenAddress(order.take.assetType)
	if (takePaymentToken !== undefined) {
		return takePaymentToken
	}
	return undefined
}

function extractPaymentTokenAddress(assetType: AssetType): Address | undefined {
	switch (assetType.assetClass) {
		case "ETH": return ZERO_ADDRESS
		case "ERC20": return assetType.contract
		default: return undefined
	}
}

function getNftAddress(order: SimpleOrder): Address | undefined {
	const makeNft = extractNftType(order.make.assetType)
	if (makeNft !== undefined) {
		return makeNft.contract
	}
	const takeNft = extractNftType(order.take.assetType)
	if (takeNft !== undefined) {
		return takeNft.contract
	}
	return undefined
}

export function getAssetTypeToken(asset: Asset): Address {
	switch (asset.assetType.assetClass) {
		case "ETH":
			return ZERO_ADDRESS
		case "ERC20":
			return asset.assetType.contract
		case "ERC721":
			return asset.assetType.contract
		case "ERC721_LAZY":
			return asset.assetType.contract
		case "ERC1155":
			return asset.assetType.contract
		case "ERC1155_LAZY":
			return asset.assetType.contract
		default: {
			throw new Error("Unsupported asset type")
		}
	}
}

export function convertOpenSeaOrderToSignDTO(ethereum: Ethereum, order: SimpleOpenSeaV1Order): OpenSeaOrderToSignDTO {
	const paymentToken = getPaymentTokenAddress(order)
	if (!paymentToken) {
		throw new Error("Maker or taker should have an ERC20 asset")
	}

	const nftAddress = getNftAddress(order)
	if (!nftAddress) {
		throw new Error("Maker or taker should have an NFT asset")
	}

	let callData: Binary
	let replacementPattern: Binary
	let basePrice: BigNumber
	const makeAssetType = order.make.assetType
	const takeAssetType = order.take.assetType

	if (makeAssetType.assetClass === "ERC721") {
		const c = createErc721Contract(ethereum, makeAssetType.contract)
		callData = toBinary(c.functionCall("transferFrom", order.maker, ZERO_ADDRESS, makeAssetType.tokenId).data)
		replacementPattern = toBinary("0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000")
		basePrice = toBigNumber(order.take.value)
	} else if (makeAssetType.assetClass === "ERC1155") {
		const c = createErc1155Contract(ethereum, makeAssetType.contract)
		callData = toBinary(c.functionCall("safeTransferFrom", order.maker, ZERO_ADDRESS, makeAssetType.tokenId, order.make.value, "0x").data)
		replacementPattern = toBinary("0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
		basePrice = toBigNumber(order.take.value)
	} else if (takeAssetType.assetClass === "ERC721") {
		const c = createErc721Contract(ethereum, takeAssetType.contract)
		callData = toBinary(c.functionCall("transferFrom", ZERO_ADDRESS, order.maker, takeAssetType.tokenId).data)
		replacementPattern = toBinary("0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
		basePrice = toBigNumber(order.make.value)
	} else if (takeAssetType.assetClass === "ERC1155") {
		const c = createErc1155Contract(ethereum, takeAssetType.contract)
		callData = toBinary(c.functionCall("safeTransferFrom", ZERO_ADDRESS, order.maker, takeAssetType.tokenId, order.take.value, "0x").data)
		replacementPattern = toBinary("0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
		basePrice = toBigNumber(order.make.value)
	} else {
		throw new Error("should never happen")
	}

	return {
		exchange: toAddress(order.data.exchange),
		maker: toAddress(order.maker),
		taker: toAddress(order.taker || ZERO_ADDRESS),
		makerRelayerFee: toBigNumber(order.data.makerRelayerFee),
		takerRelayerFee: toBigNumber(order.data.takerRelayerFee),
		makerProtocolFee: toBigNumber(order.data.makerProtocolFee),
		takerProtocolFee: toBigNumber(order.data.takerProtocolFee),
		feeRecipient: order.data.feeRecipient,
		feeMethod: OrderOpenSeaV1DataV1FeeMethod[order.data.feeMethod],
		side: OrderOpenSeaV1DataV1Side[order.data.side],
		saleKind: OrderOpenSeaV1DataV1SaleKind[order.data.saleKind],
		target: nftAddress,
		howToCall: OrderOpenSeaV1DataV1HowToCall[order.data.howToCall],
		calldata: callData,
		replacementPattern,
		staticTarget: order.data.staticTarget,
		staticExtradata: order.data.staticExtraData,
		paymentToken,
		basePrice,
		extra: toBigNumber(order.data.extra),
		listingTime: toBigNumber(String(order.start || 0)),
		expirationTime: toBigNumber(String(order.end || 0)),
		salt: toBigNumber(toBn(order.salt).toString(10)),
	}
}

function createEIP712Domain(chainId: number, verifyingContract: Address): EIP712Domain {
	return {
		...EIP712_DOMAIN_TEMPLATE,
		verifyingContract: verifyingContract,
		chainId,
	}
}

export function orderToStruct(ethereum: Ethereum, order: SimpleRaribleV2Order) {
	const [dataType, data] = encodeData(ethereum, order.data)
	return {
		maker: order.maker,
		makeAsset: assetToStruct(ethereum, order.make),
		taker: order.taker ?? ZERO_ADDRESS,
		takeAsset: assetToStruct(ethereum, order.take),
		salt: order.salt,
		start: order.start ?? 0,
		end: order.end ?? 0,
		dataType,
		data,
	}
}

function assetToStruct(ethereum: Ethereum, asset: Asset) {
	return {
		assetType: assetTypeToStruct(ethereum, asset.assetType),
		value: asset.value,
	}
}
