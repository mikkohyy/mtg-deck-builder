const DeckBuilderButtonRow = ({ openCardSets }) => {
  return(
    <div>
      <button onClick={() => openCardSets()}>Open card set</button>
      <button>Edit card set</button>
      <button>Save deck</button>
      <button>Open deck</button>
    </div>
  )
}

export default DeckBuilderButtonRow