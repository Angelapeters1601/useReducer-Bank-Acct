import "./App.css";
import { useReducer } from "react";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example 
that I used as an analogy to explain how useReducer works,
 but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: 
openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount.
 Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true.
 If it's not, just return the original state object. 
 You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. 
There is also a minimum deposit amount of 500 to open an 
account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met,
 the requested amount will be registered in the 'loan' state,
  and it will be added to the balance. 
 If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens:
 the money is taken from the balance, 
and the 'loan' will get back to 0. This can lead to negative balances, 
but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan,
 AND if the balance is zero. If this condition is not met, just return the state.
  If the condition is met, the account is deactivated and all money is withdrawn. 
  The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  depositValue: "",
  withdrawValue: "",
  loanInput: "",
  loanPayInput: "",
  errorMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "openAccount":
      return { ...state, balance: 500, isActive: true };
    case "setDeposit":
      return { ...state, depositValue: action.payload };
    case "setLoan":
      return { ...state, loanInput: action.payload };
    case "setWithdraw":
      return { ...state, withdrawValue: action.payload };
    case "setLoanPay":
      return { ...state, loanPayInput: action.payload };
    case "deposit":
      return {
        ...state,
        balance: state.balance + state.depositValue,
        depositValue: "",
      };
    case "withdraw":
      if (
        state.balance < action.payload ||
        state.balance < state.withdrawValue
      ) {
        return state;
      }
      return {
        ...state,
        balance: state.balance - state.withdrawValue,
        withdrawValue: "",
      };
    case "withdrawAll":
      return { ...state, balance: 0 };
    case "requestLoan":
      if (state.loan > 0) {
        return state;
      }
      return {
        ...state,
        loan: state.loanInput,
        balance: state.balance + state.loanInput,
        loanInput: "",
      };
    case "payLoan":
      if (state.balance === 0 || state.loanPayInput > state.loan) return state;
      return {
        ...state,
        loan: state.loan - state.loanPayInput,
        balance: state.balance - state.loanPayInput,
        loanPayInput: "",
      };
    case "closeAccount":
      if (!state.isActive || state.loan !== 0 || state.balance !== 0) {
        return {
          ...state,
          errorMessage: "Please ensure your loan is paid and balance 0!",
        };
      }
      return { ...initialState, errorMessage: "" };
    default:
      throw new Error("unknown action");
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    balance,
    loan,
    isActive,
    depositValue,
    withdrawValue,
    loanInput,
    loanPayInput,
    errorMessage,
  } = state;

  return (
    <>
      <div className="title">
        <h1>BudgetBee </h1>- <br></br>
        <p> Buzzing around to manage small finances 💲.</p>
      </div>

      <div className="App">
        <div className="total-value">
          <p>Balance: ${balance}</p>
          <p>Loan: ${loan}</p>
        </div>

        <p>
          <button
            onClick={() => dispatch({ type: "openAccount" })}
            disabled={isActive}
          >
            Open account
          </button>
        </p>
        <p>
          <input
            type="number"
            value={depositValue}
            placeholder="Enter a value.."
            onChange={(e) =>
              dispatch({ type: "setDeposit", payload: Number(e.target.value) })
            }
          />
          <button
            onClick={() => dispatch({ type: "deposit" })}
            disabled={!isActive}
          >
            Deposit
          </button>
        </p>
        <p>
          <input
            type="number"
            value={withdrawValue}
            placeholder="Enter a value.."
            onChange={(e) =>
              dispatch({ type: "setWithdraw", payload: Number(e.target.value) })
            }
          />
          <button
            onClick={() => dispatch({ type: "withdraw" })}
            disabled={!isActive}
          >
            Withdraw
          </button>
          <button
            onClick={() => dispatch({ type: "withdrawAll" })}
            disabled={!isActive}
          >
            Withdraw all
          </button>
        </p>
        <p>
          <input
            type="number"
            placeholder="Enter a value.."
            value={loanInput}
            onChange={(e) =>
              dispatch({ type: "setLoan", payload: Number(e.target.value) })
            }
          />
          <button
            onClick={() => dispatch({ type: "requestLoan" })}
            disabled={!isActive}
          >
            Request a loan
          </button>
        </p>
        <p>
          <input
            type="number"
            placeholder="Enter a value.."
            value={loanPayInput}
            onChange={(e) =>
              dispatch({ type: "setLoanPay", payload: Number(e.target.value) })
            }
          />
          <button
            onClick={() => dispatch({ type: "payLoan" })}
            disabled={!isActive}
          >
            Pay loan
          </button>
        </p>
        <p>
          <button
            onClick={() => dispatch({ type: "closeAccount" })}
            disabled={!isActive}
          >
            Close account
          </button>
        </p>
        {errorMessage && <p className="error-msg">{errorMessage}</p>}
      </div>
    </>
  );
}
