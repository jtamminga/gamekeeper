import { Link } from "@app/components"



export function Settings() {
  return (
    <>
      <h1>Settings</h1>
      
      <div className="link-list">
        <Link page={{ name: 'Players' }}>Manage Players</Link>
        <Link page={{ name: 'Goals' }}>Manage Goals</Link>
      </div>
    </>
  )
}