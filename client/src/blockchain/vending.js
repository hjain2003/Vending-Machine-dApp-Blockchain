import Web3 from 'web3';
import VendingMachineABI from './build/VendingMachine.json'

const provider = new Web3.providers.HttpProvider(
    "https://ethereum-sepolia.blockpi.network/v1/rpc/public"
)

const web3 = new Web3(provider);

const abi = VendingMachineABI.abi;
const contractAdd = "0xb44B5CC7354629b1D2cF9a070Cb69f1231455ec1"

const vmContract = new web3.eth.Contract(abi,contractAdd);

export default vmContract;