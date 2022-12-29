import { apiClient } from 'app/utils'
import { RecordForm } from './form'


export default async function RecordPage() {
  const data = await apiClient.getRecord()

  return (
    <div>
      record:
      
      <RecordForm {...data} />

    </div>
  )
}