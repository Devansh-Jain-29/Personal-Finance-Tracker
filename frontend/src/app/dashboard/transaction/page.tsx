import Transactions from "@/components/dashboard/transaction/transaction";
import React from "react";

const transactionPage = () => {
  return (
    <div>
      <Transactions showAllTransactions={true} />
    </div>
  );
};

export default transactionPage;
