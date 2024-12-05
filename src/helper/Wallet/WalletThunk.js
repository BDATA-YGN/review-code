import { Alert, Linking, Platform } from 'react-native';
import { requestTransactionList, requestWalletAmount } from "../Wallet/WalletModel";
import { setFetchTransactionData, setTransactionList, setWalletAmount, setwalletCount } from "../../stores/slices/WalletSlice";
import { useSelector } from 'react-redux';



export const getTransaction = async (dispatch, filteredTransactions, limit , page) => {
    try {
        dispatch(setFetchTransactionData(true));
        const response = await requestTransactionList(dispatch, filteredTransactions, limit , page);
        if (response.api_status === 200) {
            console.log('succss get',response.message);
          
            const prevList = useSelector(state => state.WalletSlice.transactionList);
            const newTransactionList = [ ...prevList, ...response.message];
            console.log('prevList', prevList);

            
            dispatch(setTransactionList(newTransactionList));
            
            dispatch(setwalletCount(response.count));
            dispatch(setFetchTransactionData(false)); // Update fetch status after delay
        } else {
            Alert.alert('Warning!', 'Getting unknown status.');
        }
    } catch (error) {
        dispatch(setFetchTransactionData(false));
        //   dispatch(setEmptyMessage('Network Error!.Please try again.'));
    } finally {
        dispatch(setFetchTransactionData(false)); // Ensure to update fetch status in case of error
    }
};
export const getWalletAmt = async (dispatch) => {
    try {
        dispatch(setFetchTransactionData(true));
        const response = await requestWalletAmount(dispatch);
        if (response.api_status === 200) {
            dispatch(setWalletAmount(response.message));
        } else {
            Alert.alert('Warning!', 'Getting unknown status.');
        }
    } catch (error) {
        dispatch(setFetchTransactionData(false));
        //   dispatch(setEmptyMessage('Network Error!.Please try again.'));
    } finally {
        dispatch(setFetchTransactionData(false)); // Ensure to update fetch status in case of error
    }
};