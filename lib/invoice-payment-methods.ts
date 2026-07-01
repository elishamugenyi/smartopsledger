export type InvoicePaymentMethods = {
  paymentBankName: string | null;
  paymentAccountName: string | null;
  paymentAccountNumber: string | null;
  paymentSwiftCode: string | null;
  paymentOtherMethods: string | null;
};

export const invoicePaymentMethodSelect = {
  paymentBankName: true,
  paymentAccountName: true,
  paymentAccountNumber: true,
  paymentSwiftCode: true,
  paymentOtherMethods: true,
} as const;

export function hasAnyPaymentMethod(methods: Partial<InvoicePaymentMethods>) {
  return Boolean(
    methods.paymentBankName?.trim() ||
      methods.paymentAccountName?.trim() ||
      methods.paymentAccountNumber?.trim() ||
      methods.paymentSwiftCode?.trim() ||
      methods.paymentOtherMethods?.trim(),
  );
}

export function normalizePaymentMethodsInput(body: {
  paymentBankName?: string;
  paymentAccountName?: string;
  paymentAccountNumber?: string;
  paymentSwiftCode?: string;
  paymentOtherMethods?: string;
}): InvoicePaymentMethods {
  return {
    paymentBankName: body.paymentBankName?.trim() || null,
    paymentAccountName: body.paymentAccountName?.trim() || null,
    paymentAccountNumber: body.paymentAccountNumber?.trim() || null,
    paymentSwiftCode: body.paymentSwiftCode?.trim() || null,
    paymentOtherMethods: body.paymentOtherMethods?.trim() || null,
  };
}

export function paymentMethodsFingerprint(methods: InvoicePaymentMethods) {
  return [
    methods.paymentBankName ?? "",
    methods.paymentAccountName ?? "",
    methods.paymentAccountNumber ?? "",
    methods.paymentSwiftCode ?? "",
    methods.paymentOtherMethods ?? "",
  ].join("|");
}
