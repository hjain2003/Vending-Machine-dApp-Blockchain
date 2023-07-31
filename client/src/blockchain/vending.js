import VendingMachineABI from './build/VendingMachine.json'


const abi = VendingMachineABI.abi;
const contractAdd = "0x1B6E23D35E54EFbBD582D774B84EF494a22bdd02"

const vendingMachineContract = web3 =>{
    return new web3.eth.Contract(abi,contractAdd);
}

export default vendingMachineContract;