import React from 'react'

interface LayoutProps {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  main?: React.ReactNode
  detail?: React.ReactNode
}

export function MailboxLayout({
  header,
  sidebar,
  main,
  detail,
}: LayoutProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      <div>{header}</div>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 240 }}>{sidebar}</div>
        <div style={{ flex: 1 }}>{main}</div>
        {detail && (
          <div style={{ width: 400 }}>{detail}</div>
        )}
      </div>
    </div>
  )
}

export function MailboxHeader(_: Record<string, unknown>) {
  return <header style={{ padding: 8 }}>Nextra Mail</header>
}

export function MailboxSidebar(_: Record<string, unknown>) {
  return <nav style={{ padding: 8 }}>Sidebar</nav>
}

export function ThreadList(_: Record<string, unknown>) {
  return <div style={{ padding: 8 }}>Thread list</div>
}

export function EmailDetail(_: Record<string, unknown>) {
  return <div style={{ padding: 8 }}>Email detail</div>
}

export function ComposeWindow(_: Record<string, unknown>) {
  return <div style={{ padding: 8 }}>Compose</div>
}
