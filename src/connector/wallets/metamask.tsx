class Metamask implements IWallet {
    cbAccountsChanged?: CallbackAccountsChanged
    cbChainChanged?: CallbackChainChanged
    async connect(): Promise<ConnectResult> {
        const { ethereum } = window
        if (ethereum) {
            try {
                ethereum.on('accountsChanged', (accounts: any) => {
                    if (this.isConnected && this.cbAccountsChanged) {
                        this.cbAccountsChanged(accounts[0])
                    }
                })
                ethereum.on('chainChanged', (currentChainId: number) => {
                    if (this.isConnected && this.cbChainChanged) {
                        this.cbChainChanged(currentChainId)
                    }
                })
                const accounts = await ethereum.request({
                    method: 'eth_requestAccounts',
                })
                if (accounts.length) {
                    const address = accounts[0]
                    const chainid = Number(
                        await ethereum.request({ method: 'eth_chainId' })
                    )
                    return { connected: true, address, chainid, errmsg: '' }
                } else {
                    return {
                        connected: false,
                        address: '',
                        chainid: 0,
                        errmsg: '🦊 No selected address.',
                    }
                }
            } catch (error) {
                return {
                    connected: false,
                    address: '',
                    chainid: 0,
                    errmsg:
                        '🦊 Connect to Metamask using the button on the top right.',
                }
            }
        }
        return {
            connected: false,
            address: '',
            chainid: 0,
            errmsg:
                '🦊 You must install Metamask into your browser: https://metamask.io/download.html',
        }
    }

    disconnect(): void {
        delete this.cbAccountsChanged
        delete this.cbChainChanged
    }

    setCallback(
        cbAccountsChanged: CallbackAccountsChanged,
        cbChainChanged: CallbackChainChanged
    ) {
        this.cbAccountsChanged = cbAccountsChanged
        this.cbChainChanged = cbChainChanged
    }

    get isConnected() {
        return window.ethereum && window.ethereum.isConnected()
    }

    async sendTx(
        from: string,
        to: string,
        abi: any,
        method: string,
        args: Array<string>
    ): Promise<SendTxResult> {
        try {
            const { Web3 } = window
            const { ethereum } = window
            if (Web3 && ethereum) {
                const web3 = new Web3(ethereum)
                const contract = new web3.eth.Contract(abi, to)
                const data = contract.methods[method](...args).encodeABI()
                const json = { from, to, value: 0x0, data }
                const res = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [json],
                })
                if (res) return { success: true, txid: res }
            } else {
                return {
                    success: false,
                    errmsg:
                        '🦊 Connect to Metamask using the button on the top right.',
                }
            }
        } catch (err:any) {
            let errmsg
            if (err.code === 4001) {
                errmsg = '您取消了交易'
            } else {
                errmsg = err.message
            }
            return { success: false, errmsg }
        }
        return { success: false, errmsg: '无知错误' }
    }
}

export default Metamask
