"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuota } from "@/lib/api/use-quota";
import { Download, ImageDown } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shortener.0x1.in";

interface QrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string | null;
}

export function QrDialog({ open, onOpenChange, code }: QrDialogProps) {
  const t = useTranslations("Links");
  const { isPro } = useQuota();
  const [size, setSize] = useState("256");
  const imgRef = useRef<HTMLImageElement>(null);

  if (!code) return null;

  // Always use SVG for display (PNG not supported in edge runtime)
  const qrUrl = `${API_URL}/api/qr/${code}?size=${size}&format=svg`;

  const handleDownloadSvg = async () => {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `qr-${code}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadPng = async () => {
    // Convert SVG to PNG client-side
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Wait for image to load if not already
    if (!img.complete) {
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });
    }

    const imgSize = parseInt(size);
    canvas.width = imgSize;
    canvas.height = imgSize;

    // Fill white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, imgSize, imgSize);

    // Draw SVG image
    ctx.drawImage(img, 0, 0, imgSize, imgSize);

    // Download as PNG
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `qr-${code}.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("qr.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Preview */}
          <div className="flex justify-center">
            <img
              ref={imgRef}
              src={qrUrl}
              alt="QR Code"
              className="max-w-[256px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
              crossOrigin="anonymous"
            />
          </div>

          {/* Size Options */}
          <div className="space-y-2">
            <Label>{t("qr.size")}</Label>
            <Select value={size} onValueChange={(v) => v && setSize(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128x128</SelectItem>
                <SelectItem value="256">256x256</SelectItem>
                <SelectItem value="512">512x512</SelectItem>
                <SelectItem value="1024">1024x1024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pro Features */}
          {isPro && (
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Pro users can customize QR colors via API parameters
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button.cancel")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadSvg}>
              <Download className="size-4 mr-1" />
              SVG
            </Button>
            <Button onClick={handleDownloadPng}>
              <ImageDown className="size-4 mr-1" />
              PNG
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}