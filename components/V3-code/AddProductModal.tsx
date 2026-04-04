import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Sparkles } from "lucide-react";
import { useState } from "react";

interface AddProductModalProps {
  trigger?: React.ReactNode;
}

export function AddProductModal({ trigger }: AddProductModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-2xl bg-gradient-to-r from-primary to-clay text-primary-foreground gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-xs h-9 px-4">
            <Plus size={15} />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-strong rounded-2xl border-white/25 max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Product</DialogTitle>
          <p className="text-xs text-muted-foreground">Our molecular engine will analyze ingredient safety</p>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Product Name</Label>
            <Input placeholder="e.g. Vitamin C Serum" className="rounded-xl border-border/40 bg-background/40 h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand</Label>
            <Input placeholder="e.g. GlowLab" className="rounded-xl border-border/40 bg-background/40 h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Ingredients</Label>
            <Textarea
              placeholder="Paste ingredients list here..."
              className="rounded-xl border-border/40 bg-background/40 min-h-[100px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Product Image</Label>
            <div className="border border-dashed border-border/40 rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 hover:bg-primary/3 transition-all duration-300">
              <Upload size={22} className="mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-xs text-muted-foreground">Click to upload or drag & drop</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="w-full rounded-2xl h-12 bg-gradient-to-r from-primary via-clay to-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
          >
            <Sparkles size={16} />
            Analyze & Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
