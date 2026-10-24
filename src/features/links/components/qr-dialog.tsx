import { useRef } from 'react'
import { DownloadIcon } from 'lucide-react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { displayShortLink, shortLinkFor } from '../lib/short-link'

interface QrDialogProps {
  shortCode: string
  children: React.ReactNode
}

function download(href: string, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = filename
  anchor.click()
}

export function QrDialog({ shortCode, children }: QrDialogProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const url = shortLinkFor(shortCode)

  function downloadSvg() {
    const markup = new XMLSerializer().serializeToString(svgRef.current!)
    const blob = new Blob([markup], { type: 'image/svg+xml' })
    const href = URL.createObjectURL(blob)
    download(href, `${shortCode}.svg`)
    URL.revokeObjectURL(href)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal">Scan to open</DialogTitle>
          <DialogDescription className="font-mono">{displayShortLink(shortCode)}</DialogDescription>
        </DialogHeader>
        {/* QR stays black-on-white in both themes: scanners need the contrast. */}
        <div className="mx-auto rounded-2xl border bg-white p-5 shadow-[0_1px_0_var(--border)]">
          <QRCodeSVG ref={svgRef} value={url} size={208} marginSize={0} level="M" />
          <QRCodeCanvas ref={canvasRef} value={url} size={1024} marginSize={4} level="M" className="hidden" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => download(canvasRef.current!.toDataURL('image/png'), `${shortCode}.png`)}>
            <DownloadIcon /> PNG
          </Button>
          <Button variant="outline" onClick={downloadSvg}>
            <DownloadIcon /> SVG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
