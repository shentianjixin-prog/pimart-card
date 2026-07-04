import type { Lang } from "@/lib/translations";

export type BuybackCopy = {
  docTitle: string;
  brand: string;
  intro: string;
  orderNo: string;
  entryDate: string;
  lineBtn: string;
  formHint: string;
  furigana: string;
  gender: string;
  male: string;
  female: string;
  name: string;
  nameSuffix: string;
  birth: string;
  year: string;
  month: string;
  day: string;
  address: string;
  postal: string;
  prefecture: string;
  city: string;
  addressLine: string;
  phone: string;
  mobile: string;
  homePhone: string;
  email: string;
  occupation: string;
  occExecutive: string;
  occEmployee: string;
  occCivil: string;
  occSelf: string;
  occHousewife: string;
  occStudent: string;
  occOther: string;
  bankSection: string;
  bankName: string;
  branchName: string;
  accountType: string;
  accountOrdinary: string;
  accountCurrent: string;
  accountNumber: string;
  accountHolder: string;
  idSection: string;
  idLicense: string;
  idInsurance: string;
  idPassport: string;
  idOther: string;
  invoiceSection: string;
  invoiceNot: string;
  invoiceYes: string;
  invoiceNo: string;
  legalTitle: string;
  legalAntiSocial: string;
  legalOwnership: string;
  guardianTitle: string;
  guardianNote: string;
  guardianName: string;
  guardianPhone: string;
  guardianAddress: string;
  itemsTitle: string;
  colNo: string;
  colTitle: string;
  colProduct: string;
  colQty: string;
  itemExample: string;
  addRow: string;
  note: string;
  toConfirm: string;
  confirmTitle: string;
  back: string;
  submit: string;
  successTitle: string;
  successDesc: string;
  yourOrderNo: string;
  backHome: string;
  minorCheck: string;
  errRequired: string;
  errEmail: string;
  errPhone: string;
  errAddress: string;
  errBank: string;
  errId: string;
  errInvoice: string;
  errLegal: string;
  errItems: string;
  errGuardian: string;
  errServer: string;
};

const COPY: Record<Lang, BuybackCopy> = {
  ja: {
    docTitle: "買取承諾書",
    brand: "PIMART CARD",
    intro:
      "この度は買取のお申し込みありがとうございます。下記必要事項をご記入のうえ、本人確認書類の写しを添えてご提出ください。",
    orderNo: "受付番号",
    entryDate: "記入日",
    lineBtn: "LINEでお問い合わせ",
    formHint: "オンライン買取申込フォーム",
    furigana: "フリガナ",
    gender: "性別",
    male: "男性",
    female: "女性",
    name: "お名前",
    nameSuffix: "様",
    birth: "生年月日",
    year: "年",
    month: "月",
    day: "日",
    address: "ご住所",
    postal: "〒",
    prefecture: "都道府県",
    city: "市区町村",
    addressLine: "番地・建物名",
    phone: "電話番号 ※1",
    mobile: "携帯電話",
    homePhone: "ご自宅",
    email: "メールアドレス ※2",
    occupation: "ご職業",
    occExecutive: "会社役員",
    occEmployee: "会社員",
    occCivil: "公務員",
    occSelf: "自営業",
    occHousewife: "主婦",
    occStudent: "学生",
    occOther: "その他",
    bankSection: "お振込先",
    bankName: "銀行名",
    branchName: "支店名",
    accountType: "口座種別",
    accountOrdinary: "普通",
    accountCurrent: "当座",
    accountNumber: "口座番号",
    accountHolder: "口座名義（カタカナ）",
    idSection: "本人確認書類",
    idLicense: "運転免許証",
    idInsurance: "健康保険証",
    idPassport: "パスポート",
    idOther: "その他",
    invoiceSection: "適格請求書発行事業者",
    invoiceNot: "適格請求書発行事業者でない",
    invoiceYes: "適格請求書発行事業者である",
    invoiceNo: "インボイス登録番号 T-",
    legalTitle: "以下の内容をご確認のうえ、チェックをお願いします",
    legalAntiSocial:
      "（1）私は、暴力団員、暴力団関係者、その他反社会的勢力ではないこと、また関与していないことを表明します。",
    legalOwnership: "（2）売却商品は私自身の所有物であり、不正取得品ではないことを表明します。",
    guardianTitle: "保護者記入欄（18歳未満のお客様）",
    guardianNote:
      "※18歳未満の方は保護者名義の口座への振込となります。保護者の本人確認書類写し・署名・押印が必要です。",
    guardianName: "保護者氏名",
    guardianPhone: "電話番号",
    guardianAddress: "ご住所",
    itemsTitle: "買取依頼商品情報",
    colNo: "No.",
    colTitle: "タイトル",
    colProduct: "商品名＋型番",
    colQty: "数量",
    itemExample: "例",
    addRow: "行を追加",
    note: "備考",
    toConfirm: "確認画面へ",
    confirmTitle: "入力内容の確認",
    back: "修正する",
    submit: "送信する",
    successTitle: "買取申込を受け付けました",
    successDesc: "内容を確認のうえ、1〜2営業日以内にメールでご連絡します。本人確認書類は返信メールの案内に従ってご送付ください。",
    yourOrderNo: "受付番号",
    backHome: "ホームに戻る",
    minorCheck: "18歳未満です",
    errRequired: "必須項目を入力してください",
    errEmail: "メールアドレスの形式が正しくありません",
    errPhone: "携帯または自宅電話のいずれかを入力してください",
    errAddress: "住所を入力してください",
    errBank: "振込先情報を入力してください",
    errId: "本人確認書類を選択してください",
    errInvoice: "適格請求書発行事業者の区分を選択してください",
    errLegal: "確認事項にチェックを入れてください",
    errItems: "買取商品を1件以上、正しい数量で入力してください",
    errGuardian: "保護者情報を入力してください",
    errServer: "送信に失敗しました。しばらくしてから再度お試しください",
  },
  zh: {
    docTitle: "买取承诺书",
    brand: "PIMART CARD",
    intro: "感谢您申请买取服务。请填写以下必填项，并准备本人确认证件复印件一并提交。",
    orderNo: "受理编号",
    entryDate: "填写日期",
    lineBtn: "通过 LINE 咨询",
    formHint: "在线买取申请单",
    furigana: "姓名假名",
    gender: "性别",
    male: "男",
    female: "女",
    name: "姓名",
    nameSuffix: "先生/女士",
    birth: "出生日期",
    year: "年",
    month: "月",
    day: "日",
    address: "地址",
    postal: "邮编",
    prefecture: "都道府县",
    city: "市区町村",
    addressLine: "街道・门牌",
    phone: "电话 ※1",
    mobile: "手机",
    homePhone: "住宅",
    email: "邮箱 ※2",
    occupation: "职业",
    occExecutive: "公司高管",
    occEmployee: "公司职员",
    occCivil: "公务员",
    occSelf: "个体经营",
    occHousewife: "主妇",
    occStudent: "学生",
    occOther: "其他",
    bankSection: "汇款账户",
    bankName: "银行名",
    branchName: "支行名",
    accountType: "账户类型",
    accountOrdinary: "普通",
    accountCurrent: "当座",
    accountNumber: "账号",
    accountHolder: "户名（片假名）",
    idSection: "本人确认证件",
    idLicense: "驾照",
    idInsurance: "健康保险证",
    idPassport: "护照",
    idOther: "其他",
    invoiceSection: "适格发票发行事业者",
    invoiceNot: "非适格发票发行事业者",
    invoiceYes: "是适格发票发行事业者",
    invoiceNo: "发票注册号 T-",
    legalTitle: "请确认以下内容并勾选",
    legalAntiSocial: "（1）本人不是暴力团或反社会势力，且未与其有关联。",
    legalOwnership: "（2）出售商品为本人合法所有，非不正当取得。",
    guardianTitle: "监护人栏（未满18岁）",
    guardianNote: "※未满18岁仅向监护人名义账户汇款，需监护人证件复印件及签名。",
    guardianName: "监护人姓名",
    guardianPhone: "电话",
    guardianAddress: "地址",
    itemsTitle: "买取商品信息",
    colNo: "No.",
    colTitle: "系列/标题",
    colProduct: "商品名＋编号",
    colQty: "数量",
    itemExample: "例",
    addRow: "添加一行",
    note: "备注",
    toConfirm: "前往确认",
    confirmTitle: "请确认填写内容",
    back: "返回修改",
    submit: "提交",
    successTitle: "买取申请已受理",
    successDesc: "我们将在1–2个工作日内邮件联系。请按回复邮件指引提交本人确认证件。",
    yourOrderNo: "受理编号",
    backHome: "返回首页",
    minorCheck: "未满18岁",
    errRequired: "请填写必填项",
    errEmail: "邮箱格式不正确",
    errPhone: "请填写手机或住宅电话",
    errAddress: "请填写地址",
    errBank: "请填写汇款账户信息",
    errId: "请选择本人确认证件",
    errInvoice: "请选择发票事业者区分",
    errLegal: "请勾选确认事项",
    errItems: "请至少填写一件买取商品及正确数量",
    errGuardian: "请填写监护人信息",
    errServer: "提交失败，请稍后重试",
  },
  en: {
    docTitle: "Buyback Agreement",
    brand: "PIMART CARD",
    intro:
      "Thank you for your buyback request. Please complete all required fields and prepare a copy of your ID document.",
    orderNo: "Reference No.",
    entryDate: "Date",
    lineBtn: "Contact via LINE",
    formHint: "Online Buyback Application",
    furigana: "Name (Kana)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    name: "Full name",
    nameSuffix: "",
    birth: "Date of birth",
    year: "Year",
    month: "Month",
    day: "Day",
    address: "Address",
    postal: "Postal code",
    prefecture: "Prefecture",
    city: "City",
    addressLine: "Street / building",
    phone: "Phone ※1",
    mobile: "Mobile",
    homePhone: "Home",
    email: "Email ※2",
    occupation: "Occupation",
    occExecutive: "Executive",
    occEmployee: "Employee",
    occCivil: "Civil servant",
    occSelf: "Self-employed",
    occHousewife: "Homemaker",
    occStudent: "Student",
    occOther: "Other",
    bankSection: "Bank transfer details",
    bankName: "Bank name",
    branchName: "Branch",
    accountType: "Account type",
    accountOrdinary: "Ordinary",
    accountCurrent: "Current",
    accountNumber: "Account number",
    accountHolder: "Account holder (Katakana)",
    idSection: "ID document",
    idLicense: "Driver's license",
    idInsurance: "Health insurance card",
    idPassport: "Passport",
    idOther: "Other",
    invoiceSection: "Qualified invoice issuer",
    invoiceNot: "Not a qualified invoice issuer",
    invoiceYes: "Is a qualified invoice issuer",
    invoiceNo: "Invoice registration No. T-",
    legalTitle: "Please confirm and check the following",
    legalAntiSocial:
      "(1) I am not associated with organized crime or other anti-social forces.",
    legalOwnership: "(2) The items sold are my lawful property and were not illegally obtained.",
    guardianTitle: "Guardian (under 18)",
    guardianNote: "Payments to minors are made only to a guardian's bank account with ID verification.",
    guardianName: "Guardian name",
    guardianPhone: "Phone",
    guardianAddress: "Address",
    itemsTitle: "Items for buyback",
    colNo: "No.",
    colTitle: "Title",
    colProduct: "Product + model",
    colQty: "Qty",
    itemExample: "Ex.",
    addRow: "Add row",
    note: "Notes",
    toConfirm: "Review",
    confirmTitle: "Confirm your details",
    back: "Edit",
    submit: "Submit",
    successTitle: "Buyback application received",
    successDesc: "We will contact you within 1–2 business days. Please send ID copies as instructed in our reply.",
    yourOrderNo: "Reference No.",
    backHome: "Back to home",
    minorCheck: "I am under 18",
    errRequired: "Please fill required fields",
    errEmail: "Invalid email",
    errPhone: "Enter mobile or home phone",
    errAddress: "Enter your address",
    errBank: "Enter bank details",
    errId: "Select ID document type",
    errInvoice: "Select invoice issuer status",
    errLegal: "Please check both declarations",
    errItems: "Add at least one item with valid quantity",
    errGuardian: "Enter guardian details",
    errServer: "Submission failed. Please try again",
  },
};

export function buybackCopy(lang: Lang): BuybackCopy {
  return COPY[lang];
}

export function errorMessage(copy: BuybackCopy, code?: string) {
  const map: Record<string, string> = {
    required: copy.errRequired,
    email: copy.errEmail,
    phone: copy.errPhone,
    address: copy.errAddress,
    bank: copy.errBank,
    id: copy.errId,
    invoice: copy.errInvoice,
    legal: copy.errLegal,
    items: copy.errItems,
    guardian: copy.errGuardian,
    server: copy.errServer,
  };
  return code ? map[code] : undefined;
}
