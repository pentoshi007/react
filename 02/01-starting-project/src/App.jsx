import componentsImg from "./assets/Components.png";
import Header from "./components/Header/Header.jsx";
import TabButton from "./components/TabButton.jsx";
import { useState } from "react";
import { CORE_CONCEPTS } from "./data.js";
import { EXAMPLES } from "./data.js";

import CoreConcepts from "./components/CoreConcepts.jsx";

function App() {
  // const [selectedTopic, setSelectedTopic] = useState("components");
  const [selectedTopic, setSelectedTopic] = useState();
  // const [selectedTopic, setSelectedTopic] = useState(EXAMPLES["components"]);

  function handleSelect(selectedButton) {
    // setSelectedTopic(selectedButton);
    setSelectedTopic(EXAMPLES[selectedButton]);
  }
  return (
    <div>
      <Header />

      <main>
        <h2>Time to get started!</h2>

        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            {CORE_CONCEPTS.map((item) => (
              <CoreConcepts key={item.title} {...item} />
            ))}
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton
              isSelected={selectedTopic?.title === "Components"}
              onSelect={() => handleSelect("components")}
            >
              Components
            </TabButton>
            <TabButton
              isSelected={selectedTopic?.title === "JSX"}
              onSelect={() => handleSelect("jsx")}
            >
              JSX
            </TabButton>
            <TabButton
              isSelected={selectedTopic?.title === "Props"}
              onSelect={() => handleSelect("props")}
            >
              Props
            </TabButton>
            <TabButton
              isSelected={selectedTopic?.title === "State"}
              onSelect={() => handleSelect("state")}
            >
              State
            </TabButton>
          </menu>
          {!selectedTopic && <p>Please select a topic.</p>}
          {/* <div id="tab-content">
            <h3>{EXAMPLES[selectedTopic].title}</h3>
            <p>{EXAMPLES[selectedTopic].description}</p>
            <pre>
              <code>{EXAMPLES[selectedTopic].code}</code>
            </pre>
          </div> */}
          {selectedTopic && (
            <div id="tab-content">
              <h3>{selectedTopic.title}</h3>
              <p>{selectedTopic.description}</p>
              <pre>
                <code>{selectedTopic.code}</code>
              </pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
