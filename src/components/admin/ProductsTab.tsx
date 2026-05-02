import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Package, Search, X, Check, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  getBikeModels,
  addBikeModel,
  removeBikeModel,
  type ProductEntry,
} from "@/lib/store";

const CATEGORIES = ["Tires", "Lubricants", "Parts", "Gear"] as const;
type Category = (typeof CATEGORIES)[number];

type FormState = {
  name: string;
  category: Category;
  price: string;
  image: string;
  badge: string;
  compatibleModels: string[];
};

type FormErrors = Partial<Record<keyof FormState | "models", string>>;

const emptyForm: FormState = {
  name: "",
  category: "Parts",
  price: "",
  image: "",
  badge: "",
  compatibleModels: [],
};

export default function ProductsTab() {
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [allModels, setAllModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModel, setNewModel] = useState("");
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<ProductEntry | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    Promise.all([getProducts(), getBikeModels()]).then(([p, m]) => {
      setProducts(p);
      setAllModels(m);
      setLoading(false);
    });
  }, []);

  const refresh = async () => setProducts(await getProducts());

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setImageError(false);
    setView("form");
  };

  const openEdit = (product: ProductEntry) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      image: product.image,
      badge: product.badge ?? "",
      compatibleModels: [...product.compatibleModels],
    });
    setErrors({});
    setImageError(false);
    setView("form");
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (form.compatibleModels.length === 0) e.models = "Select at least one compatible model";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const data = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image.trim(),
      badge: form.badge.trim() || undefined,
      compatibleModels: form.compatibleModels,
    };
    if (editing) {
      await updateProduct(editing.id, data);
    } else {
      await saveProduct(data);
    }
    await refresh();
    setView("list");
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await refresh();
    setDeleteConfirm(null);
  };

  const toggleModel = (model: string) => {
    setForm(f => ({
      ...f,
      compatibleModels: f.compatibleModels.includes(model)
        ? f.compatibleModels.filter(m => m !== model)
        : [...f.compatibleModels, model],
    }));
  };

  const handleAddModel = async () => {
    const name = newModel.trim();
    if (!name) return;
    const updated = await addBikeModel(name);
    if (updated.length === allModels.length) return;
    setAllModels(updated);
    setNewModel("");
    setForm(f => ({ ...f, compatibleModels: [...f.compatibleModels, name] }));
  };

  const handleRemoveModel = async (model: string) => {
    const updated = await removeBikeModel(model);
    setAllModels(updated);
    setForm(f => ({ ...f, compatibleModels: f.compatibleModels.filter(m => m !== model) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setImageError(false);
    const path = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("products").upload(path, file);
    if (error) { setImageUploading(false); return; }
    const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.path);
    setForm(f => ({ ...f, image: urlData.publicUrl }));
    setImageUploading(false);
    e.target.value = "";
  };

  const filtered = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground font-barlow text-sm">
        Loading products…
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-oswald font-bold uppercase text-xl">Products</h2>
            <p className="font-barlow text-muted-foreground text-sm">{products.length} total products in shop</p>
          </div>
          <Button onClick={openAdd} className="font-oswald uppercase tracking-wider w-fit">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 font-barlow"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-secondary relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-oswald uppercase tracking-wider px-2 py-0.5 rounded">
                    {product.badge}
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-black/60 text-xs font-barlow px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <div className="p-3">
                <p className="font-oswald font-semibold text-sm uppercase leading-snug line-clamp-2 mb-1">
                  {product.name}
                </p>
                <p className="font-oswald text-primary font-bold text-lg mb-1">
                  ₱{product.price.toLocaleString()}
                </p>
                <p className="font-barlow text-muted-foreground text-xs">
                  {product.compatibleModels.length} compatible model{product.compatibleModels.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex border-t border-border">
                <button
                  onClick={() => openEdit(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-oswald uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <div className="w-px bg-border" />
                {deleteConfirm === product.id ? (
                  <div className="flex-1 flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleDelete(product.id)}
                      title="Confirm delete"
                      className="flex items-center gap-1 text-xs font-oswald uppercase text-destructive hover:bg-destructive/10 px-3 py-2 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-xs font-oswald uppercase text-muted-foreground hover:bg-secondary px-3 py-2 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-oswald uppercase tracking-wider text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Package className="w-12 h-12 opacity-30" />
              <p className="font-barlow text-lg">
                {search ? "No products match your search." : "No products yet."}
              </p>
              {!search && (
                <Button onClick={openAdd} variant="outline" className="font-oswald uppercase tracking-wider">
                  <Plus className="w-4 h-4 mr-2" /> Add First Product
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setView("list")}
          className="font-barlow text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Products
        </button>
        <h2 className="font-oswald font-bold uppercase text-xl">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="p-name" className="font-oswald uppercase tracking-wider text-xs">
            Product Name *
          </Label>
          <Input
            id="p-name"
            placeholder="e.g. Pirelli Angel GT2 Front"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="font-barlow"
          />
          {errors.name && <p className="text-xs text-destructive font-barlow">{errors.name}</p>}
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-oswald uppercase tracking-wider text-xs">Category *</Label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-barlow ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-price" className="font-oswald uppercase tracking-wider text-xs">
              Price (₱) *
            </Label>
            <Input
              id="p-price"
              type="number"
              min="1"
              placeholder="0"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="font-barlow"
            />
            {errors.price && <p className="text-xs text-destructive font-barlow">{errors.price}</p>}
          </div>
        </div>

        {/* Badge */}
        <div className="space-y-2">
          <Label htmlFor="p-badge" className="font-oswald uppercase tracking-wider text-xs">
            Badge <span className="text-muted-foreground normal-case font-barlow">(optional — e.g. New, Best Seller, Premium)</span>
          </Label>
          <Input
            id="p-badge"
            placeholder="e.g. New"
            value={form.badge}
            onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
            className="font-barlow"
          />
        </div>

        {/* Image */}
        <div className="space-y-2">
          <Label className="font-oswald uppercase tracking-wider text-xs">Image *</Label>
          <div className="flex gap-2">
            <Input
              id="p-image"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImageError(false); }}
              className="font-barlow flex-1"
            />
            <label className={cn(
              "flex items-center gap-1.5 px-3 h-10 rounded-md border border-border text-xs font-oswald uppercase tracking-wider cursor-pointer transition-colors shrink-0",
              imageUploading
                ? "opacity-50 pointer-events-none"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}>
              <Upload className="w-3.5 h-3.5" />
              {imageUploading ? "Uploading…" : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {errors.image && <p className="text-xs text-destructive font-barlow">{errors.image}</p>}
          {form.image && (
            <div className="mt-2 rounded-lg overflow-hidden border border-border w-48 h-36 bg-secondary flex items-center justify-center shrink-0">
              {imageError ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <span className="text-xs font-barlow">Cannot load image</span>
                </div>
              ) : (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              )}
            </div>
          )}
          <p className="text-xs font-barlow text-muted-foreground">
            Upload an image or paste a public URL (e.g. from Unsplash).
          </p>
        </div>

        {/* Compatible Models */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-oswald uppercase tracking-wider text-xs">Compatible Models *</Label>
            <button
              type="button"
              onClick={() =>
                setForm(f => ({
                  ...f,
                  compatibleModels:
                    f.compatibleModels.length === allModels.length ? [] : [...allModels],
                }))
              }
              className="text-xs font-barlow text-primary hover:underline"
            >
              {form.compatibleModels.length === allModels.length ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allModels.map(model => (
              <div key={model} className="relative group">
                <label
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 pr-7 rounded-lg border cursor-pointer transition-colors font-barlow text-sm w-full",
                    form.compatibleModels.includes(model)
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={form.compatibleModels.includes(model)}
                    onChange={() => toggleModel(model)}
                    className="accent-primary shrink-0"
                  />
                  <span className="truncate">{model}</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveModel(model)}
                  title="Remove this model"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Input
              placeholder="Add new model (e.g. Honda ADV 160)"
              value={newModel}
              onChange={e => setNewModel(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddModel(); } }}
              className="font-barlow text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddModel}
              className="font-oswald uppercase tracking-wider shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>

          {errors.models && (
            <p className="text-xs text-destructive font-barlow">{errors.models}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-8">
          <Button onClick={handleSubmit} className="font-oswald uppercase tracking-wider">
            {editing ? "Save Changes" : "Add Product"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setView("list")}
            className="font-oswald uppercase tracking-wider"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
