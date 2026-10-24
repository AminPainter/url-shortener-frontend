import { LinkStub } from '@/features/links/components/link-stub'

const SAMPLE = {
  shortCode: 'Am1nSh7',
  longUrl: 'https://example.com/blog/the-surprisingly-long-history-of-the-hyperlink?utm_source=newsletter&utm_medium=email&utm_campaign=oct',
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1.1fr]">
      <div className="flex items-center justify-center px-6 py-16">{children}</div>
      <aside className="paper-grain relative hidden items-center overflow-hidden border-l bg-secondary/60 px-12 lg:flex">
        <div className="hairline-grid absolute inset-0 -z-10" />
        <div className="w-full max-w-lg space-y-6">
          <p className="font-display text-5xl leading-[1.05]">
            One hundred and twenty-seven characters, <em className="highlighter">cut to seven.</em>
          </p>
          <div className="-rotate-2 transition-transform duration-500 hover:rotate-0">
            <LinkStub link={SAMPLE} />
          </div>
        </div>
      </aside>
    </div>
  )
}
