/* import JSBI from 'jsbi' */

/* import abiStorefront from './abi/storefront.json'
import abiErc20 from './abi/erc20.json' */

import Config from '../config/v1.json'
/* import IWallet,{CallbackAccountsChanged,CallbackChainChanged} from './wallets/IWallet' */

import Metamask from './wallets/metamask'

interface CONFIG {
	[chainid: number]: NETWORKCONFIG
}
interface NETWORKCONFIG {
	title: string
	rpc: string
	explorer: string
	blocktime: number

	masterChef: string
	mulltiCall: string

	tokens: {
		[token:string]: {
			contract: string,
			symbol: string,
			decimals: number,
			projectLink: string
		}
	}
}

const conf = Config as CONFIG;

/* const ONE = JSBI.BigInt(1) */
/* const TEN = JSBI.BigInt(10)
 */

class Connector implements IConnector {
	instance?: IWallet
	currentAddress?: string
	currentChainId?: number
	conf?: NETWORKCONFIG

	get connected(): boolean {
		return ((this.instance && this.instance.isConnected && this.conf !== undefined) || false)
	}

	get address(): string | undefined {
		return (this.connected && this.currentAddress) || undefined
	}
	get chainId(): number | undefined {
		return (this.connected && this.currentChainId) || undefined
	}
	get chainName(): string | undefined {
		return (this.connected && this.conf && this.conf.title) || undefined
	}
	get explorer(): string {
		return (this.connected && this.conf && this.conf.explorer) || ''
	}

	async connect(walletname: string): Promise<ConnectResult> {
		if (this.instance) this.instance.disconnect()
		if (walletname === 'metamask') {
			this.instance = new Metamask()
		}
		if (this.instance) {
			const result = await this.instance.connect()
			if (result.connected) {
				this.conf = conf[result.chainid]
				if (this.conf) {
					this.currentAddress = result.address
					this.currentChainId = result.chainid
				} else {
					return {
						connected: false,
						address: '',
						chainid: 0,
						errmsg: 'Invalid chain id.',
					}
				}
			}
			return result
		}
		return {
			connected: false,
			address: '',
			chainid: 0,
			errmsg: 'not installed wallet or invalid.',
		}
	}
	disconnect(): void {
		if (this.instance) this.instance.disconnect()
	}
	setCallback(
		cbAccountsChanged: CallbackAccountsChanged,
		cbChainChanged: CallbackChainChanged
	) {
		if (this.instance)
			this.instance.setCallback(cbAccountsChanged, cbChainChanged)
	}

	url(type: 'address' | 'tx', arg: string): string {
		return this.explorer + '/' + type + '/' + arg
	}
	validAddress(address: string): boolean {
		const { Web3 } = window
		if (Web3) {
			const web3 = new Web3()
			return web3.utils.isAddress(address)
		}
		return /^(0x)[0-9A-Fa-f]{40}$/.test(address)
	}
	async call(
		to: string,
		abi: string,
		method: string,
		args: Array<string>
	): Promise<any> {
		try {
			if (
				this.connected &&
				this.currentChainId &&
				conf[this.currentChainId]
			) {
				const config: NETWORKCONFIG = conf[this.currentChainId]
				const { Web3 } = window
				if (Web3) {
					const web3 = new Web3(config.rpc)
					const contract = new web3.eth.Contract(abi, to)
					const res = await contract.methods[method](...args).call()
					return res
				}
			}
			return null
		} catch (err) {
			return { err }
		}
	}

	sendTx(
		from: string,
		to: string,
		abi: any,
		method: string,
		args: string[]
	): Promise<SendTxResult> {
		return (
			(this.instance &&
				this.instance.sendTx(from, to, abi, method, args)) ||
			Promise.resolve({ success: false })
		)
	}
	async waitTransaction(txnHash: string, blocksToWait: number): Promise<any> {
		try {
			if (
				this.connected &&
				this.currentChainId &&
				conf[this.currentChainId]
			) {
				const config: NETWORKCONFIG = conf[this.currentChainId]
				const { Web3 } = window
				if (Web3) {
					const web3 = new Web3(process.env.NETWORK_URL)
					let repeat = 100
					while (--repeat > 0) {
						const time = +new Date()
						const receipt = await web3.eth.getTransactionReceipt(
							txnHash
						)
						if (receipt) {
							const resolvedReceipt = await receipt
							if (
								resolvedReceipt &&
								resolvedReceipt.blockNumber
							) {
								const block = await web3.eth.getBlock(
									resolvedReceipt.blockNumber
								)
								const current = await web3.eth.getBlock(
									'latest'
								)
								if (
									current.number - block.number >=
									blocksToWait
								) {
									const txn = await web3.eth.getTransaction(
										txnHash
									)
									if (txn.blockNumber != null)
										return (
											Number(resolvedReceipt.status) === 1
										)
								}
							}
						}
						let delay = config.blocktime - (+new Date() - time)
						if (delay < 1000) delay = 1000
						await new Promise((resolve) =>
							setTimeout(resolve, delay)
						)
					}
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
}

export default Connector
