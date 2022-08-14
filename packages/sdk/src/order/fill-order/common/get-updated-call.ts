import { toBinary } from "@rarible/types"
import type { Binary } from "@rarible/ethereum-api-client"
import { FILL_CALLDATA_TAG } from "../../../config/common"
import type { IRaribleEthereumSdkConfig } from "../../../types"

const hexRegexp = /^[0-9a-f]*$/g

export function getUpdatedCalldata(sdkConfig?: IRaribleEthereumSdkConfig): Binary | undefined {
	if (sdkConfig?.fillCalldata) {
		const fillCalldata = toBinary(sdkConfig.fillCalldata).slice(2)
		if (!hexRegexp.test(fillCalldata)) {
			throw new Error("Fill calldata is not a hex value")
		}
		if (fillCalldata.length !== 48) {
			throw new Error(`Fill call data has length = ${fillCalldata.length}, but should be = 48`)
		}
		return toBinary(`0x${fillCalldata}${FILL_CALLDATA_TAG}`)
	}
	return undefined
}
