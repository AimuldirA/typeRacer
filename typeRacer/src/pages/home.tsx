import ChooseGameMode from '../components/chooseGameMode'
import Content from '../components/content'
import Header from '../components/header'
import Leadboard from '../components/leadboard'

function Home() {

  return (
    <div className='' >
      <Content/>
      <ChooseGameMode/>
      <div className='flex w-full justify-center'>
        <Leadboard/>
      </div>
      
    </div>
  )
}

export default Home
