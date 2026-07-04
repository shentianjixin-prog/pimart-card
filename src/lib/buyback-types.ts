export type BuybackItem = {
  title: string;
  productName: string;
  quantity: string;
};

export type BuybackAgreementPayload = {
  entryDate: string;
  gender: "male" | "female" | "";
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  mobilePhone: string;
  homePhone: string;
  occupation: string;
  occupationOther: string;
  bankName: string;
  branchName: string;
  accountType: "ordinary" | "current" | "";
  accountNumber: string;
  accountHolderKana: string;
  idDocType: string;
  idDocOther: string;
  invoiceStatus: "not_issuer" | "issuer" | "";
  invoiceNumber: string;
  legalAntiSocial: boolean;
  legalOwnership: boolean;
  isMinor: boolean;
  guardianName: string;
  guardianPhone: string;
  guardianPostal: string;
  guardianPrefecture: string;
  guardianCity: string;
  guardianAddress: string;
  items: BuybackItem[];
  note: string;
};

export type BuybackDraft = BuybackAgreementPayload & {
  name: string;
  nameKana: string;
  email: string;
};

export const EMPTY_ITEM: BuybackItem = { title: "", productName: "", quantity: "" };

export function emptyDraft(): BuybackDraft {
  const today = new Date();
  const entryDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return {
    entryDate,
    name: "",
    nameKana: "",
    email: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    postalCode: "",
    prefecture: "",
    city: "",
    addressLine: "",
    mobilePhone: "",
    homePhone: "",
    occupation: "",
    occupationOther: "",
    bankName: "",
    branchName: "",
    accountType: "",
    accountNumber: "",
    accountHolderKana: "",
    idDocType: "",
    idDocOther: "",
    invoiceStatus: "",
    invoiceNumber: "",
    legalAntiSocial: false,
    legalOwnership: false,
    isMinor: false,
    guardianName: "",
    guardianPhone: "",
    guardianPostal: "",
    guardianPrefecture: "",
    guardianCity: "",
    guardianAddress: "",
    items: Array.from({ length: 5 }, () => ({ ...EMPTY_ITEM })),
    note: "",
  };
}

export function parseDraftFromFormData(fd: FormData): BuybackDraft {
  const itemCount = Number(fd.get("itemCount") || 0);
  const items: BuybackItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push({
      title: String(fd.get(`item_title_${i}`) || "").trim(),
      productName: String(fd.get(`item_product_${i}`) || "").trim(),
      quantity: String(fd.get(`item_qty_${i}`) || "").trim(),
    });
  }

  return {
    entryDate: String(fd.get("entryDate") || "").trim(),
    name: String(fd.get("name") || "").trim(),
    nameKana: String(fd.get("nameKana") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    gender: (String(fd.get("gender") || "") as BuybackDraft["gender"]) || "",
    birthYear: String(fd.get("birthYear") || "").trim(),
    birthMonth: String(fd.get("birthMonth") || "").trim(),
    birthDay: String(fd.get("birthDay") || "").trim(),
    postalCode: String(fd.get("postalCode") || "").trim(),
    prefecture: String(fd.get("prefecture") || "").trim(),
    city: String(fd.get("city") || "").trim(),
    addressLine: String(fd.get("addressLine") || "").trim(),
    mobilePhone: String(fd.get("mobilePhone") || "").trim(),
    homePhone: String(fd.get("homePhone") || "").trim(),
    occupation: String(fd.get("occupation") || "").trim(),
    occupationOther: String(fd.get("occupationOther") || "").trim(),
    bankName: String(fd.get("bankName") || "").trim(),
    branchName: String(fd.get("branchName") || "").trim(),
    accountType: (String(fd.get("accountType") || "") as BuybackDraft["accountType"]) || "",
    accountNumber: String(fd.get("accountNumber") || "").trim(),
    accountHolderKana: String(fd.get("accountHolderKana") || "").trim(),
    idDocType: String(fd.get("idDocType") || "").trim(),
    idDocOther: String(fd.get("idDocOther") || "").trim(),
    invoiceStatus: (String(fd.get("invoiceStatus") || "") as BuybackDraft["invoiceStatus"]) || "",
    invoiceNumber: String(fd.get("invoiceNumber") || "").trim(),
    legalAntiSocial: fd.get("legalAntiSocial") === "on",
    legalOwnership: fd.get("legalOwnership") === "on",
    isMinor: fd.get("isMinor") === "on",
    guardianName: String(fd.get("guardianName") || "").trim(),
    guardianPhone: String(fd.get("guardianPhone") || "").trim(),
    guardianPostal: String(fd.get("guardianPostal") || "").trim(),
    guardianPrefecture: String(fd.get("guardianPrefecture") || "").trim(),
    guardianCity: String(fd.get("guardianCity") || "").trim(),
    guardianAddress: String(fd.get("guardianAddress") || "").trim(),
    items,
    note: String(fd.get("note") || "").trim(),
  };
}

export function validateBuybackDraft(draft: BuybackDraft): string | null {
  if (!draft.name || !draft.nameKana || !draft.email) return "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) return "email";
  if (!draft.mobilePhone && !draft.homePhone) return "phone";
  if (!draft.postalCode || !draft.prefecture || !draft.city || !draft.addressLine) return "address";
  if (!draft.bankName || !draft.branchName || !draft.accountType || !draft.accountNumber || !draft.accountHolderKana) {
    return "bank";
  }
  if (!draft.idDocType) return "id";
  if (!draft.invoiceStatus) return "invoice";
  if (!draft.legalAntiSocial || !draft.legalOwnership) return "legal";
  const filledItems = draft.items.filter((i) => i.productName && i.quantity);
  if (filledItems.length === 0) return "items";
  if (filledItems.some((i) => !/^\d+$/.test(i.quantity) || Number(i.quantity) < 1)) return "items";
  if (draft.isMinor) {
    if (!draft.guardianName || !draft.guardianPhone || !draft.guardianPrefecture || !draft.guardianCity) {
      return "guardian";
    }
  }
  return null;
}

export function payloadFromDraft(draft: BuybackDraft): BuybackAgreementPayload {
  const { name: _n, nameKana: _k, email: _e, ...payload } = draft;
  return {
    ...payload,
    items: draft.items.filter((i) => i.productName && i.quantity),
  };
}
