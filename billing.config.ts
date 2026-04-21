import type { BillingConfig } from "usebilling";

const billingConfig: BillingConfig = {
  test: {
    plans: [
      {
        id: "prod_UMzwvvuI1wuH2f",
        name: "Premium",
        description: "Access to all features",
        price: [
          {
            id: "price_1TOFwzFmKS8STqAOYRV6Ek89",
            amount: 1000,
            currency: "usd",
            interval: "month",
          },
          {
            id: "price_1TOFx0FmKS8STqAO9HaaZf7E",
            amount: 10000,
            currency: "usd",
            interval: "year",
          },
        ],
      },
      {
        id: "prod_UMzwtmMPpGdm9Z",
        name: "Pro",
        description: "Access to all features year round",
        price: [
          {
            id: "price_1TOFx1FmKS8STqAORISfjqL3",
            amount: 10000,
            currency: "usd",
            interval: "year",
          },
        ],
      },
      //{
        //id: "prod_UHuCo4mBtBbsog",
        //name: "Smartops Ledger",
        //description: "Automate invoicing in your business, run your operations worry free while smartops Ledgers helps run your business.",
        //price: [
          //{
            //id: "price_1TJKNvFmKS8STqAObZW5f3qX",
            //amount: 2000,
            //currency: "usd",
            //interval: "month",
          //},
        //],
      //},
    ],
  },
  production: {
    plans: [
      {
        name: "Premium",
        description: "Access to all features",
        price: [
          {
            amount: 1000,
            currency: "usd",
            interval: "month",
          },
          {
            amount: 10000,
            currency: "usd",
            interval: "year",
          },
        ],
      },
      {
        name: "Pro",
        description: "Access to all features year round",
        price: [
          {
            amount: 10000,
            currency: "usd",
            interval: "year",
          },
        ],
      },
    ],
  },
};

export default billingConfig;
