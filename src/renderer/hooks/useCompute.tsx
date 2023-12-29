import { Link } from "@solomon-ai/component-library";
import { useEffect, useMemo } from "react";

const useComputeBankAccountTotals = (link: Link): number => {
  const totalBalance = useMemo(() => {
    return (
      link.bankAccounts?.reduce((acc, account) => acc + account.balance, 0) ?? 0
    );
  }, [link]);

  useEffect(() => {
    // Perform any side effects or additional logic here
    // This effect will run whenever the 'link' prop changes
  }, [link]);

  return totalBalance;
};
