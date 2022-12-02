import styled from 'styled-components'
const KeyValuePair = styled.div`
  padding-left: ${props => props.indent}em;
  display: flex;
`

const Key = styled.div`
  white-space: nowrap;
`


const Value = styled.div`
  padding-left: 0.5em;
`
const CardExample = () => {
  const rulesText = `Don't try to outrun one of Dominaria's grizzlies;
                    it'll catch you, knock you down, and eat you.
                    Of course, you could run up a tree. In that cas
                    you'll get a nice view before it knocks the three
                    down and eats you.`

  return(
    <div>
      {'\u007b'}
      <KeyValuePair indent={2}>
        <Key>
          Name:
        </Key>
        <Value>
          {'\u0027'}Grizzly Bears{'\u0027'}
        </Value>
      </KeyValuePair>
      <KeyValuePair indent={2}>
        <Key>
          Price:
        </Key>
        <Value>
          0.34
        </Value>
      </KeyValuePair>
      <KeyValuePair indent={2}>
        <Key>
        Rarity:
        </Key>
        <Value>
          {'\u0027'}common{'\u0027'}
        </Value>
      </KeyValuePair>
      <KeyValuePair indent={2}>
        <Key>
          Number:
        </Key>
        <Value>
          256
        </Value>
      </KeyValuePair>
      <KeyValuePair indent={2}>
        <Key>
          Mana cost:
        </Key>
        <Value>
          {'\u0027'}1 green{'\u0027'}
        </Value>
      </KeyValuePair>
      <KeyValuePair indent={2}>
        <Key>
         Rules text:
        </Key>
        <Value>
          {'\u0027'}{rulesText}{'\u0027'}
        </Value>
      </KeyValuePair>
      {'\u007d'}
    </div>
  )
}

export default CardExample