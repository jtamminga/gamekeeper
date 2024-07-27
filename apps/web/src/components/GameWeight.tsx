type Props = {
  weight: number
  className?: string
}

export function GameWeight({ weight, className }: Props) {
  return (
    <div className={"game-weight" + (className ? className : "")}>
      {weight}
    </div>
  )
}