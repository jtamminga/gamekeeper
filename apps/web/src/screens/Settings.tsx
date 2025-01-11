import { authEnabled } from '@app/bootstrap'
import { Link } from "@app/components"


export function Settings() {

  return (
    <>
      <h1>Settings</h1>
      
      <div className="link-list">
        {authEnabled &&
          <Link page={{ name: 'Profile'}}>Profile</Link>
        }
        <Link page={{ name: 'Players' }}>Manage Players</Link>
        <Link page={{ name: 'Goals' }}>Manage Goals</Link>
      </div>
    </>
  )
}