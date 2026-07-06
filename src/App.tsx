import Header from './components/Header'
import HeroVideo from './components/HeroVideo'
import ProjectsGrid from './components/ProjectsGrid'
import Footer from './components/Footer'
import PhysicsMode from './components/PhysicsMode'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <HeroVideo />
        <ProjectsGrid />
      </main>
      <Footer />
      <PhysicsMode />
    </>
  )
}
