import styled from "styled-components";
import Hero from "./components/Hero";
import Footer from "./components/Footer";


const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  color: white;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  scroll-snap-align: start; 
`;

const App = () => {
  return (
    <Container>
      
      <Section id="home">
        <Hero />
      </Section>
     
     
      <Section id="footer">
        <Footer/>
      </Section>  
 

    </Container>
  );
};

export default App;
    