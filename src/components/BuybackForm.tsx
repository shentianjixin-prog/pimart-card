"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitBuybackRequest, type BuybackFormState } from "@/app/buyback/actions";
import { buybackCopy, errorMessage } from "@/lib/buyback-copy";
import {
  emptyDraft,
  parseDraftFromFormData,
  validateBuybackDraft,
  type BuybackDraft,
} from "@/lib/buyback-types";
import { LINE_CONTACT_URL } from "@/lib/site";
import type { Lang } from "@/lib/translations";

function LabelCell({
  children,
  className = "",
  rowSpan,
}: {
  children: React.ReactNode;
  className?: string;
  rowSpan?: number;
}) {
  return (
    <th className={`buyback-sheet-label ${className}`} rowSpan={rowSpan}>
      {children}
    </th>
  );
}

function FieldCell({ children, className = "", colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td className={`buyback-sheet-field ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function SheetInput({
  name,
  defaultValue,
  type = "text",
  className = "",
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  type?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`buyback-sheet-input ${className}`}
    />
  );
}

function ConfirmBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="border-b border-[rgba(17,24,39,0.08)] pb-3">
      <dt className="text-xs text-[#9ca3af]">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-[#111827]">{value}</dd>
    </div>
  );
}

export function BuybackForm({ lang }: { lang: Lang }) {
  const copy = buybackCopy(lang);
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [draft, setDraft] = useState<BuybackDraft>(() => emptyDraft());
  const [itemRows, setItemRows] = useState(5);
  const [clientError, setClientError] = useState<string | undefined>();
  const [orderNo, setOrderNo] = useState("");
  const [state, action, pending] = useActionState<BuybackFormState, FormData>(
    submitBuybackRequest,
    {}
  );

  useEffect(() => {
    if (state.ok && state.orderNo) {
      setOrderNo(state.orderNo);
      setStep("done");
    }
  }, [state.ok, state.orderNo]);

  if (step === "done") {
    return (
      <div className="buyback-sheet buyback-sheet-success">
        <p className="buyback-sheet-brand">{copy.brand}</p>
        <h1 className="buyback-sheet-title">{copy.successTitle}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#374151]">{copy.successDesc}</p>
        {orderNo && (
          <p className="mt-6 rounded-lg border border-[rgba(17,24,39,0.12)] bg-[#f8fafc] px-4 py-3 text-center">
            <span className="text-xs text-[#6b7280]">{copy.yourOrderNo}</span>
            <span className="mt-1 block text-lg font-semibold tracking-wide text-[#111827]">{orderNo}</span>
          </p>
        )}
        <Link href="/" className="buyback-submit-btn mt-8 inline-flex min-h-11 items-center justify-center px-8">
          {copy.home}
        </Link>
      </div>
    );
  }

  if (step === "confirm") {
    const items = draft.items.filter((i) => i.productName && i.quantity);
    return (
      <div className="buyback-sheet">
        <p className="buyback-sheet-brand">{copy.brand}</p>
        <h1 className="buyback-sheet-title">{copy.confirmTitle}</h1>
        <dl className="mt-6 space-y-3">
          <ConfirmBlock label={copy.name} value={draft.name} />
          <ConfirmBlock label={copy.furigana} value={draft.nameKana} />
          <ConfirmBlock label={copy.email} value={draft.email} />
          <ConfirmBlock
            label={copy.address}
            value={`${draft.postalCode} ${draft.prefecture}${draft.city}${draft.addressLine}`}
          />
          <ConfirmBlock label={copy.mobile} value={draft.mobilePhone} />
          <ConfirmBlock label={copy.home} value={draft.homePhone} />
          <ConfirmBlock
            label={copy.bankSection}
            value={`${draft.bankName} ${draft.branchName} ${draft.accountType} ${draft.accountNumber} ${draft.accountHolderKana}`}
          />
          <ConfirmBlock
            label={copy.itemsTitle}
            value={items.map((i, idx) => `${idx + 1}. ${i.title || "-"} / ${i.productName} × ${i.quantity}`).join("\n")}
          />
          <ConfirmBlock label={copy.note} value={draft.note} />
        </dl>
        {(clientError || state.error) && (
          <p className="mt-4 text-sm text-red-600">{errorMessage(copy, clientError || state.error)}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => setStep("form")} className="btn-secondary min-h-11 rounded-full px-8">
            {copy.back}
          </button>
          <form action={action}>
            <input type="hidden" name="draftJson" value={JSON.stringify(draft)} />
            <button type="submit" disabled={pending} className="buyback-submit-btn min-h-11 px-10">
              {pending ? "..." : copy.submit}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="buyback-page">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <a href={LINE_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="buyback-line-btn sm:max-w-xs">
          {copy.lineBtn}
        </a>
      </div>

      <div className="buyback-sheet">
        <p className="buyback-sheet-brand">{copy.brand}</p>
        <h1 className="buyback-sheet-title">{copy.docTitle}</h1>
        <p className="buyback-sheet-intro">{copy.intro}</p>

        <div className="buyback-sheet-meta">
          <span>{copy.entryDate}：{draft.entryDate}</span>
        </div>

        <p className="buyback-sheet-subtitle">{copy.formHint}</p>

        <form
          ref={formRef}
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(formRef.current!);
            fd.set("itemCount", String(itemRows));
            fd.set("entryDate", draft.entryDate);
            const next = parseDraftFromFormData(fd);
            const err = validateBuybackDraft(next);
            if (err) {
              setClientError(err);
              return;
            }
            setClientError(undefined);
            setDraft(next);
            setStep("confirm");
          }}
        >
          <input type="hidden" name="entryDate" value={draft.entryDate} />
          <input type="hidden" name="itemCount" value={itemRows} />

          <table className="buyback-sheet-table">
            <tbody>
              <tr>
                <LabelCell>{copy.furigana}</LabelCell>
                <FieldCell colSpan={3}>
                  <SheetInput name="nameKana" defaultValue={draft.nameKana} />
                </FieldCell>
                <LabelCell>{copy.gender}</LabelCell>
                <FieldCell>
                  <label className="buyback-inline-check">
                    <input type="radio" name="gender" value="male" defaultChecked={draft.gender === "male"} />
                    {copy.male}
                  </label>
                  <label className="buyback-inline-check ml-3">
                    <input type="radio" name="gender" value="female" defaultChecked={draft.gender === "female"} />
                    {copy.female}
                  </label>
                </FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.name}</LabelCell>
                <FieldCell colSpan={3}>
                  <div className="flex items-center gap-2">
                    <SheetInput name="name" defaultValue={draft.name} className="flex-1" />
                    {copy.nameSuffix && <span className="text-sm text-[#374151]">{copy.nameSuffix}</span>}
                  </div>
                </FieldCell>
                <LabelCell>{copy.birth}</LabelCell>
                <FieldCell>
                  <div className="flex flex-wrap items-center gap-1">
                    <SheetInput name="birthYear" defaultValue={draft.birthYear} className="w-16" placeholder="YYYY" />
                    <span className="text-xs">{copy.year}</span>
                    <SheetInput name="birthMonth" defaultValue={draft.birthMonth} className="w-10" />
                    <span className="text-xs">{copy.month}</span>
                    <SheetInput name="birthDay" defaultValue={draft.birthDay} className="w-10" />
                    <span className="text-xs">{copy.day}</span>
                  </div>
                </FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.address}</LabelCell>
                <FieldCell colSpan={5}>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm">{copy.postal}</span>
                      <SheetInput name="postalCode" defaultValue={draft.postalCode} className="w-28" placeholder="123-4567" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <SheetInput name="prefecture" defaultValue={draft.prefecture} placeholder={copy.prefecture} />
                      <SheetInput name="city" defaultValue={draft.city} placeholder={copy.city} />
                      <SheetInput name="addressLine" defaultValue={draft.addressLine} placeholder={copy.addressLine} />
                    </div>
                  </div>
                </FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.phone}</LabelCell>
                <FieldCell colSpan={5}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <span className="mb-1 block text-xs text-[#6b7280]">{copy.mobile}</span>
                      <SheetInput name="mobilePhone" defaultValue={draft.mobilePhone} />
                    </div>
                    <div>
                      <span className="mb-1 block text-xs text-[#6b7280]">{copy.home}</span>
                      <SheetInput name="homePhone" defaultValue={draft.homePhone} />
                    </div>
                  </div>
                </FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.email}</LabelCell>
                <FieldCell colSpan={5}>
                  <SheetInput name="email" type="email" defaultValue={draft.email} />
                </FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.occupation}</LabelCell>
                <FieldCell colSpan={5}>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {[
                      ["executive", copy.occExecutive],
                      ["employee", copy.occEmployee],
                      ["civil", copy.occCivil],
                      ["self", copy.occSelf],
                      ["housewife", copy.occHousewife],
                      ["student", copy.occStudent],
                      ["other", copy.occOther],
                    ].map(([value, label]) => (
                      <label key={value} className="buyback-inline-check">
                        <input type="radio" name="occupation" value={value} defaultChecked={draft.occupation === value} />
                        {label}
                      </label>
                    ))}
                    <SheetInput name="occupationOther" defaultValue={draft.occupationOther} className="ml-1 w-32" />
                  </div>
                </FieldCell>
              </tr>
              <tr>
                <LabelCell rowSpan={2}>{copy.bankSection}</LabelCell>
                <LabelCell className="buyback-sheet-sub">{copy.bankName}</LabelCell>
                <FieldCell><SheetInput name="bankName" defaultValue={draft.bankName} /></FieldCell>
                <LabelCell className="buyback-sheet-sub">{copy.branchName}</LabelCell>
                <FieldCell colSpan={2}><SheetInput name="branchName" defaultValue={draft.branchName} /></FieldCell>
              </tr>
              <tr>
                <LabelCell className="buyback-sheet-sub">{copy.accountType}</LabelCell>
                <FieldCell>
                  <label className="buyback-inline-check">
                    <input type="radio" name="accountType" value="ordinary" defaultChecked={draft.accountType === "ordinary"} />
                    {copy.accountOrdinary}
                  </label>
                  <label className="buyback-inline-check ml-2">
                    <input type="radio" name="accountType" value="current" defaultChecked={draft.accountType === "current"} />
                    {copy.accountCurrent}
                  </label>
                </FieldCell>
                <LabelCell className="buyback-sheet-sub">{copy.accountNumber}</LabelCell>
                <FieldCell><SheetInput name="accountNumber" defaultValue={draft.accountNumber} /></FieldCell>
                <LabelCell className="buyback-sheet-sub">{copy.accountHolder}</LabelCell>
                <FieldCell><SheetInput name="accountHolderKana" defaultValue={draft.accountHolderKana} /></FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.idSection}</LabelCell>
                <FieldCell colSpan={5}>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {[
                      ["license", copy.idLicense],
                      ["insurance", copy.idInsurance],
                      ["passport", copy.idPassport],
                      ["other", copy.idOther],
                    ].map(([value, label]) => (
                      <label key={value} className="buyback-inline-check">
                        <input type="radio" name="idDocType" value={value} defaultChecked={draft.idDocType === value} />
                        {label}
                      </label>
                    ))}
                    <SheetInput name="idDocOther" defaultValue={draft.idDocOther} className="w-32" />
                  </div>
                </FieldCell>
              </tr>
              <tr>
                <LabelCell>{copy.invoiceSection}</LabelCell>
                <FieldCell colSpan={5}>
                  <div className="space-y-2 text-sm">
                    <label className="buyback-inline-check block">
                      <input type="radio" name="invoiceStatus" value="not_issuer" defaultChecked={draft.invoiceStatus === "not_issuer"} />
                      {copy.invoiceNot}
                    </label>
                    <label className="buyback-inline-check flex flex-wrap items-center gap-2">
                      <input type="radio" name="invoiceStatus" value="issuer" defaultChecked={draft.invoiceStatus === "issuer"} />
                      {copy.invoiceYes}
                      <span>{copy.invoiceNo}</span>
                      <SheetInput name="invoiceNumber" defaultValue={draft.invoiceNumber} className="w-36" />
                    </label>
                  </div>
                </FieldCell>
              </tr>
            </tbody>
          </table>

          <div className="buyback-legal mt-6">
            <p className="text-sm font-medium text-[#111827]">{copy.legalTitle}</p>
            <label className="buyback-legal-check mt-3">
              <input type="checkbox" name="legalAntiSocial" defaultChecked={draft.legalAntiSocial} />
              <span>{copy.legalAntiSocial}</span>
            </label>
            <label className="buyback-legal-check mt-2">
              <input type="checkbox" name="legalOwnership" defaultChecked={draft.legalOwnership} />
              <span>{copy.legalOwnership}</span>
            </label>
          </div>

          <div className="buyback-guardian mt-6">
            <label className="buyback-inline-check text-sm font-medium">
              <input type="checkbox" name="isMinor" defaultChecked={draft.isMinor} />
              {copy.minorCheck}
            </label>
            <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">{copy.guardianNote}</p>
            <table className="buyback-sheet-table mt-3">
              <tbody>
                <tr>
                  <LabelCell>{copy.guardianTitle}</LabelCell>
                  <FieldCell colSpan={5}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <SheetInput name="guardianName" defaultValue={draft.guardianName} placeholder={copy.guardianName} />
                      <SheetInput name="guardianPhone" defaultValue={draft.guardianPhone} placeholder={copy.guardianPhone} />
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <SheetInput name="guardianPostal" defaultValue={draft.guardianPostal} placeholder={copy.postal} />
                      <SheetInput name="guardianPrefecture" defaultValue={draft.guardianPrefecture} placeholder={copy.prefecture} />
                      <SheetInput name="guardianCity" defaultValue={draft.guardianCity} placeholder={copy.city} />
                    </div>
                    <SheetInput name="guardianAddress" defaultValue={draft.guardianAddress} className="mt-2" placeholder={copy.addressLine} />
                  </FieldCell>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="buyback-items-title">{copy.itemsTitle}</h2>
          <table className="buyback-sheet-table buyback-items-table">
            <thead>
              <tr>
                <th className="buyback-sheet-label w-12">{copy.colNo}</th>
                <th className="buyback-sheet-label">{copy.colTitle}</th>
                <th className="buyback-sheet-label">{copy.colProduct}</th>
                <th className="buyback-sheet-label w-20">{copy.colQty}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="buyback-example-row">
                <td className="buyback-sheet-field text-center text-xs text-[#9ca3af]">{copy.itemExample}</td>
                <td className="buyback-sheet-field text-xs text-[#9ca3af]">ポケカ</td>
                <td className="buyback-sheet-field text-xs text-[#9ca3af]">ドンメル 198/193</td>
                <td className="buyback-sheet-field text-xs text-[#9ca3af]">1</td>
              </tr>
              {Array.from({ length: itemRows }, (_, i) => (
                <tr key={`item-row-${i}`}>
                  <td className="buyback-sheet-field text-center text-sm text-[#6b7280]">{i + 1}</td>
                  <td className="buyback-sheet-field">
                    <SheetInput name={`item_title_${i}`} defaultValue={draft.items[i]?.title || ""} />
                  </td>
                  <td className="buyback-sheet-field">
                    <SheetInput name={`item_product_${i}`} defaultValue={draft.items[i]?.productName || ""} />
                  </td>
                  <td className="buyback-sheet-field">
                    <SheetInput name={`item_qty_${i}`} defaultValue={draft.items[i]?.quantity || ""} className="text-center" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-[#111827] underline-offset-2 hover:underline"
            onClick={() => setItemRows((n) => n + 1)}
          >
            ＋ {copy.addRow}
          </button>

          <div className="mt-5">
            <label className="buyback-label">{copy.note}</label>
            <textarea name="note" defaultValue={draft.note} rows={3} className="buyback-input min-h-[80px] resize-y" />
          </div>

          {clientError && (
            <p className="mt-4 text-sm text-red-600">{errorMessage(copy, clientError)}</p>
          )}

          <div className="mt-8 text-center">
            <button type="submit" className="buyback-submit-btn min-h-11 min-w-[220px] px-10">
              {copy.toConfirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
