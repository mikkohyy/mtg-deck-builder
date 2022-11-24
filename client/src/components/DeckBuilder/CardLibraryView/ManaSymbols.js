import styled from 'styled-components'

const Symbol = styled.span`
  font-weight: bold;
  color: ${props => props.theme.manaSymbolColors[props.color]};
`

const ManaSymbolString = ({ manaSymbols, cardName, index }) => {
  const getSymbol = (symbol, cardName) => {
    const colorSymbols = ['B','U','G','R','W']

    const color = colorSymbols.includes(symbol)
      ? symbol
      : 'other'

    return(
      <Symbol
        color={color}
        key={`${symbol}-${cardName}-${index}`}
      >
        {symbol}
      </Symbol>
    )
  }

  return(
    <div>
      {manaSymbols.map((symbol, index) => getSymbol(symbol, cardName, index))}
    </div>
  )
}

export default ManaSymbolString