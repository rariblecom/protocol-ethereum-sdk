import Web3 from "web3"
import {Address} from "@rarible/protocol-api-client"
import {Contract} from "web3-eth-contract"
import {proxyRegistryAbi} from "../../proxy-registry-opensea"

export function createOpenseaProxyRegistryContract(web3: Web3, address?: Address): Contract {
	return new web3.eth.Contract(proxyRegistryAbi, address)
}

export async function deployOpenseaProxyRegistry(web3: Web3) {
	const empty = createOpenseaProxyRegistryContract(web3)
	const [address] = await web3.eth.getAccounts()
	return empty.deploy({data: proxyRegistryBytecode}).send({from: address, gas: 4000000, gasPrice: "0"})
}

export const proxyRegistryBytecode =
    "0x6080604052621275006005556006805460ff1916905534801561002157600080fd5b5060008054600160a060020a03191633600160a060020a0316179055610045610087565b604051809103906000f080158015610061573d6000803e3d6000fd5b5060018054600160a060020a031916600160a060020a0392909216919091179055610097565b60405161085280610f2b83390190565b610e85806100a66000396000f3006080604052600436106100da5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100df5780631a86ac4f1461016957806338b6e4071461019257806353376d1f146101b55780635eebea20146101d657806369dc9ff314610209578063715018a61461022a5780638da5cb5b1461023f57806397204d8e14610270578063c455279114610285578063d4e8e063146102a6578063ddd81f82146102c7578063e71a02e1146102dc578063ef7f3834146102f1578063f2fde38b14610312575b600080fd5b3480156100eb57600080fd5b506100f4610333565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561012e578181015183820152602001610116565b50505050905090810190601f16801561015b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561017557600080fd5b5061017e61036a565b604080519115158252519081900360200190f35b34801561019e57600080fd5b506101b3600160a060020a0360043516610373565b005b3480156101c157600080fd5b506101b3600160a060020a0360043516610432565b3480156101e257600080fd5b506101f7600160a060020a036004351661046e565b60408051918252519081900360200190f35b34801561021557600080fd5b5061017e600160a060020a0360043516610480565b34801561023657600080fd5b506101b3610495565b34801561024b57600080fd5b50610254610505565b60408051600160a060020a039092168252519081900360200190f35b34801561027c57600080fd5b50610254610514565b34801561029157600080fd5b50610254600160a060020a0360043516610523565b3480156102b257600080fd5b506101b3600160a060020a036004351661053e565b3480156102d357600080fd5b506102546105bf565b3480156102e857600080fd5b506101f761076f565b3480156102fd57600080fd5b506101b3600160a060020a0360043516610775565b34801561031e57600080fd5b506101b3600160a060020a03600435166107d5565b60408051808201909152601d81527f50726f6a6563742057797665726e2050726f7879205265676973747279000000602082015281565b60065460ff1681565b60005433600160a060020a0390811691161461038e57600080fd5b600160a060020a03811660009081526004602052604090205460ff161580156103ce5750600160a060020a03811660009081526003602052604090205415155b80156103f65750600554600160a060020a038216600090815260036020526040902054429101105b151561040157600080fd5b600160a060020a0316600090815260036020908152604080832083905560049091529020805460ff19166001179055565b60005433600160a060020a0390811691161461044d57600080fd5b600160a060020a03166000908152600460205260409020805460ff19169055565b60036020526000908152604090205481565b60046020526000908152604090205460ff1681565b60005433600160a060020a039081169116146104b057600080fd5b60008054604051600160a060020a03909116917ff8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c6482091a26000805473ffffffffffffffffffffffffffffffffffffffff19169055565b600054600160a060020a031681565b600154600160a060020a031681565b600260205260009081526040902054600160a060020a031681565b60005433600160a060020a0390811691161461055957600080fd5b600160a060020a03811660009081526004602052604090205460ff161580156105985750600160a060020a038116600090815260036020526040902054155b15156105a357600080fd5b600160a060020a03166000908152600360205260409020429055565b600160a060020a03338116600090815260026020526040812054909116156105e657600080fd5b60015460408051600160a060020a033381811660248401523082166044808501919091528451808503909101815260649093019093526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f485cc9550000000000000000000000000000000000000000000000000000000017905291929190911690610673610879565b8084600160a060020a0316600160a060020a0316815260200183600160a060020a0316600160a060020a0316815260200180602001828103825283818151815260200191508051906020019080838360005b838110156106dd5781810151838201526020016106c5565b50505050905090810190601f16801561070a5780820380516001836020036101000a031916815260200191505b50945050505050604051809103906000f08015801561072d573d6000803e3d6000fd5b5033600160a060020a039081166000908152600260205260409020805473ffffffffffffffffffffffffffffffffffffffff1916918316919091179055919050565b60055481565b60005433600160a060020a0390811691161461079057600080fd5b60065460ff16156107a057600080fd5b6006805460ff199081166001908117909255600160a060020a0390921660009081526004602052604090208054909216179055565b60005433600160a060020a039081169116146107f057600080fd5b6107f9816107fc565b50565b600160a060020a038116151561081157600080fd5b60008054604051600160a060020a03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b6040516105d08061088a833901905600608060405234801561001057600080fd5b506040516105d03803806105d08339810160409081528151602083015191830151909201610046836401000000006100e0810204565b61005882640100000000610102810204565b81600160a060020a03168160405180828051906020019080838360005b8381101561008d578181015183820152602001610075565b50505050905090810190601f1680156100ba5780820380516001836020036101000a031916815260200191505b50915050600060405180830381855af491505015156100d857600080fd5b505050610165565b60018054600160a060020a031916600160a060020a0392909216919091179055565b600054600160a060020a038281169116141561011d57600080fd5b60008054600160a060020a031916600160a060020a038316908117825560405190917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b91a250565b61045c806101746000396000f3006080604052600436106100825763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663025313a281146100c85780633659cfe6146100f95780634555d5c91461011c5780634f1ef286146101435780635c60da1b1461019d5780636fde8202146101b2578063f1739cae146101c7575b600061008c6101e8565b9050600160a060020a03811615156100a357600080fd5b60405136600082376000803683855af43d806000843e8180156100c4578184f35b8184fd5b3480156100d457600080fd5b506100dd6101f7565b60408051600160a060020a039092168252519081900360200190f35b34801561010557600080fd5b5061011a600160a060020a0360043516610206565b005b34801561012857600080fd5b50610131610239565b60408051918252519081900360200190f35b60408051602060046024803582810135601f810185900485028601850190965285855261011a958335600160a060020a031695369560449491939091019190819084018382808284375094975061023e9650505050505050565b3480156101a957600080fd5b506100dd6101e8565b3480156101be57600080fd5b506100dd6102f2565b3480156101d357600080fd5b5061011a600160a060020a0360043516610301565b600054600160a060020a031690565b60006102016102f2565b905090565b61020e6101f7565b600160a060020a031633600160a060020a031614151561022d57600080fd5b61023681610391565b50565b600290565b6102466101f7565b600160a060020a031633600160a060020a031614151561026557600080fd5b61026e82610206565b30600160a060020a03168160405180828051906020019080838360005b838110156102a357818101518382015260200161028b565b50505050905090810190601f1680156102d05780820380516001836020036101000a031916815260200191505b50915050600060405180830381855af491505015156102ee57600080fd5b5050565b600154600160a060020a031690565b6103096101f7565b600160a060020a031633600160a060020a031614151561032857600080fd5b600160a060020a038116151561033d57600080fd5b7f5a3e66efaa1e445ebd894728a69d6959842ea1e97bd79b892797106e270efcd96103666101f7565b60408051600160a060020a03928316815291841660208301528051918290030190a161023681610401565b600054600160a060020a03828116911614156103ac57600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038316908117825560405190917fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b91a250565b6001805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555600a165627a7a723058200f25a6b58e2d9301edf320efa4885418920c2633f90d7d401bd6735e9e0288350029a165627a7a72305820a56fa7af46c489585603d3ced552ff7db878bf6ee8a26944ddb6113565a91c96002960806040526001805460a060020a60ff021916905534801561002057600080fd5b50610822806100306000396000f3006080604052600436106100ae5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631b0f7ba981146100ef5780633f801f911461016f5780634555d5c9146101dd578063485cc955146102045780634c93505f1461022b5780634f8632ba146102455780635c60da1b1461027657806363d256ce1461028b5780636fde8202146102a05780637b103999146102b55780638f4ffcb1146102ca575b604080513481529051600160a060020a033316917fa419615bc8fda4c87663805ee2a3597a6d71c1d476911d9892f340d965bc7bf1919081900360200190a2005b3480156100fb57600080fd5b50604080516020600460443581810135601f810184900484028501840190955284845261015b948235600160a060020a0316946024803560ff169536959460649492019190819084018382808284375094975061033a9650505050505050565b604080519115158252519081900360200190f35b34801561017b57600080fd5b50604080516020600460443581810135601f81018490048402850184019095528484526101db948235600160a060020a0316946024803560ff169536959460649492019190819084018382808284375094975061052e9650505050505050565b005b3480156101e957600080fd5b506101f2610549565b60408051918252519081900360200190f35b34801561021057600080fd5b506101db600160a060020a036004358116906024351661054e565b34801561023757600080fd5b506101db60043515156105c4565b34801561025157600080fd5b5061025a610643565b60408051600160a060020a039092168252519081900360200190f35b34801561028257600080fd5b5061025a610652565b34801561029757600080fd5b5061015b610661565b3480156102ac57600080fd5b5061025a610671565b3480156102c157600080fd5b5061025a610680565b3480156102d657600080fd5b50604080516020601f6064356004818101359283018490048402850184019095528184526101db94600160a060020a0381358116956024803596604435909316953695608494920191819084018382808284375094975061068f9650505050505050565b60025460009033600160a060020a03908116911614806103ff575060035460a060020a900460ff161580156103ff5750600354604080517f69dc9ff3000000000000000000000000000000000000000000000000000000008152600160a060020a033381166004830152915191909216916369dc9ff39160248083019260209291908290030181600087803b1580156103d257600080fd5b505af11580156103e6573d6000803e3d6000fd5b505050506040513d60208110156103fc57600080fd5b50515b151561040a57600080fd5b600083600181111561041857fe5b141561049c5783600160a060020a03168260405180828051906020019080838360005b8381101561045357818101518382015260200161043b565b50505050905090810190601f1680156104805780820380516001836020036101000a031916815260200191505b509150506000604051808303816000865af19150509050610527565b60018360018111156104aa57fe5b14156105275783600160a060020a03168260405180828051906020019080838360005b838110156104e55781810151838201526020016104cd565b50505050905090810190601f1680156105125780820380516001836020036101000a031916815260200191505b50915050600060405180830381855af4925050505b9392505050565b61053983838361033a565b151561054457600080fd5b505050565b600290565b60015460a060020a900460ff161561056557600080fd5b6001805474ff0000000000000000000000000000000000000000191660a060020a17905560028054600160a060020a0393841673ffffffffffffffffffffffffffffffffffffffff199182161790915560038054929093169116179055565b60025433600160a060020a039081169116146105df57600080fd5b6003805482151560a060020a810274ff0000000000000000000000000000000000000000199092169190911790915560408051918252517f2165014523a6f4135deffed62d70149aad59b64de5aac51e3abbcbe2a83e2f7e9181900360200190a150565b600254600160a060020a031681565b600054600160a060020a031690565b60035460a060020a900460ff1681565b600154600160a060020a031690565b600354600160a060020a031681565b604080517f23b872dd000000000000000000000000000000000000000000000000000000008152600160a060020a038681166004830152308116602483015260448201869052915184928316916323b872dd9160648083019260209291908290030181600087803b15801561070357600080fd5b505af1158015610717573d6000803e3d6000fd5b505050506040513d602081101561072d57600080fd5b5051151561073a57600080fd5b82600160a060020a031685600160a060020a03167fd65b48fd35864b3528d38e44760be5553248f89bf3ff6b06cca57817cc2650bf86856040518083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156107b457818101518382015260200161079c565b50505050905090810190601f1680156107e15780820380516001836020036101000a031916815260200191505b50935050505060405180910390a350505050505600a165627a7a72305820c00af2bb06c3ad0e3492fe6347518050b438cadef3594e159c7b63e582ca6b200029"
