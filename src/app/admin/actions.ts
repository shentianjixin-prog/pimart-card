"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createAdminSession, destroyAdminSession, getAdminSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "请输入账号和密码" };
  }

  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    return { error: "账号或密码错误" };
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    return { error: "账号或密码错误" };
  }

  await createAdminSession({ adminId: admin.id, username: admin.username });
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export type ProductFormState = { error?: string } | undefined;

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const series = String(formData.get("series") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceJpy = Number(formData.get("priceJpy"));
  const stock = Number(formData.get("stock"));
  const images = String(formData.get("images") || "").trim();
  const featured = formData.get("featured") === "on";
  const isPreorder = formData.get("isPreorder") === "on";
  const shippingDays = Number(formData.get("shippingDays"));
  const releaseDateRaw = String(formData.get("releaseDate") || "").trim();

  if (!name || !category || !images) {
    return { error: "请完整填写商品信息" as const };
  }
  if (!Number.isFinite(priceJpy) || priceJpy < 0) {
    return { error: "价格不合法" as const };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: "库存不合法" as const };
  }
  if (!Number.isFinite(shippingDays) || shippingDays < 5 || shippingDays > 7) {
    return { error: "发货天数需在 5-7 之间" as const };
  }

  let releaseDate: Date | null = null;
  if (releaseDateRaw) {
    releaseDate = new Date(releaseDateRaw);
    if (Number.isNaN(releaseDate.getTime())) {
      return { error: "预售发货日不合法" as const };
    }
  }

  return {
    data: {
      name,
      category,
      series: series || null,
      description: description || null,
      priceJpy: Math.round(priceJpy),
      stock: Math.round(stock),
      images,
      featured,
      isPreorder,
      shippingDays: Math.round(shippingDays),
      releaseDate,
    },
  };
}

function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9一-龯ぁ-んァ-ヶ]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `product-${Date.now()}`;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if ("error" in parsed) return parsed;

  const baseSlug = slugify(parsed.data.name);
  const existing = await prisma.product.count({
    where: { slug: { startsWith: baseSlug } },
  });
  const slug = existing > 0 ? `${baseSlug}-${existing + 1}` : baseSlug;
  await prisma.product.create({ data: { ...parsed.data, slug } });

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if ("error" in parsed) return parsed;

  await prisma.product.update({
    where: { id: productId },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  if (!productId) return;

  await prisma.orderItem.deleteMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function updateStockAction(productId: string, stock: number) {
  await requireAdmin();
  if (!productId || !Number.isFinite(stock) || stock < 0) return;
  await prisma.product.update({
    where: { id: productId },
    data: { stock: Math.round(stock) },
  });
  revalidatePath("/");
  revalidatePath("/admin/products");
}
