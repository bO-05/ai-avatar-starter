import { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import Head from 'next/head';
import Image from 'next/image';
import builder from '../assets/100.png';

const Home = () => {
  const maxRetries = 20;
  const [style, updateStyle] = useState('hyper-realistic');
  const [artist, updateArtist] = useState('artgerm');
  const [finishingTouches, updateFinishingTouches] =
    useState('highly-detailed');
  const [input, setInput] = useState(
    `A ${style} type image of Bram man in the style of ${artist} with ${finishingTouches} finishing touches.`
  );
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');

  const onChange = (event) => {
    setInput(event.target.value);
  };

  const onArtistChange = (value) => {
    updateArtist(value);
    setInput(
      `A ${style} type image of Bram man in the style of ${artist} with ${finishingTouches} finishing touches.`
    );
  };

  const onStyleChange = (value) => {
    updateStyle(value);
    setInput(
      `A ${style} type image of Bram man in the style of ${artist} with ${finishingTouches} finishing touches.`
    );
  };

  const onFinishingTouchesChange = (value) => {
    updateFinishingTouches(value);
    setInput(
      `A ${style} type image of Bram man in the style of ${artist} with ${finishingTouches} finishing touches.`
    );
  };

  const generateAction = async () => {
    console.log('Generating. . .');

    // Make sure there is no double click
    if (isGenerating && retry === 0) return;

    // Set loading has started
    setIsGenerating(true);

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    // Add the fetch request
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    // If model still loading, drop retry time
    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      console.log('Model is loading still. . .');

      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);

      // stop loading
      setIsGenerating(false);

      return;
    }

    // Final prompt
    setFinalPrompt(input);

    // Remove input content
    setInput('');

    // Set image data into state property
    setImg(data.image);

    // Everything is all done - stop loading
    setIsGenerating(false);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className="root">
      <Head>
        <title>AI Bram generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Generate Bram</h1>
          </div>
          <div className="header-subtitle">
            {/* Add description here */}
            <h2>
              Get creative, customize, and style me with this AI avatar
              generator!
            </h2>
            <p className="text-yellow">
              It's easy and fun! Play with the settings below and see what you
              get.
            </p>
          </div>
          {/* Add prompt container here */}
          <div className="prompt-container">
            <Typeahead
              onChange={(selected) => {
                onStyleChange(selected);
              }}
              options={[
                'realistic',
                'oil painting',
                'pencil drawing',
                'concept art',
                'watercolor',
                'studio ghibli',
                '3d',
                'ukiyo-e',
                'soviet propaganda',
                'playtoon',
                'anime',
                'low-poly',
                'neon mecha',
              ]}
              id="style"
              placeholder="Style"
            />
            <Typeahead
              onChange={(selected) => {
                onArtistChange(selected);
              }}
              options={[
                'Giotto di Bondone',
                'Hubert and Jan van Eyck',
                'Piero della Francesca',
                'Sandro Botticelli',
                'Albrecht Dürer',
                'Leonardo da Vinci',
                'Michelangelo',
                'Raphael',
                'Titian',
                'El Greco',
                'Jusepe de Ribera',
                'Peter Paul Rubens',
                'Rembrandt',
                'Johannes Vermeer',
                'Antoine Watteau',
                'Giambattista Tiepolo',
                'Canaletto',
                'Francisco Goya',
                'Jacques-Louis David',
                'Théodore Géricault',
                'John Constable',
                'J.M.W. Turner',
                'Eugène Delacroix',
                'Ivan Aivazovsky',
                'Vincent van Gogh',
                'Paul Cézanne',
                'Gustave Courbet',
                'Gustav Klimt',
                'Claude Monet',
                'Édouard Manet',
                'Rennie Mackintosh',
                'Georges Seurat',
                'Paul Signac',
                'Paul Gauguin',
                'Henri Rousseau',
                'Félix Vallotton',
                'Pablo Picasso',
                'Marc Chagall',
                'George Grosz',
                'Alberto Giacometti',
                'Frida Kahlo',
                'Salvador Dalí',
                'René Magritte',
                'Hiroshige',
                'Andrew Wyeth',
                'Jackson Pollock',
                'Mark Rothko',
                'Willem de Kooning',
                'Cy Twombly',
                'Andy Warhol',
                'David Hockney',
                'Roy Lichtenstein',
                'Brice Marden',
                'Gerhard Richter',
                'Christopher Wool',
                'Yayoi Kusama',
                'Francis Bacon',
                'Jeff Koons',
                'Jean-Michel Basquiat',
                'Chuck Close',
                'Ellsworth Kelly',
                'Cindy Sherman',
                'Hilma Af Kint',
                'Kazuo Shiraga',
                'Kerry James Marshall',
                'Julian Schnabel',
                'Cecily Brown',
                'Mickalene Thomas',
                'Laura Owens',
                'Mark Bradford',
                'Yoshitomo Nara',
                'Rashid Johnson',
                'Tauba Auerbach',
                'David LaChapelle',
                'Alex Katz',
                'Louise Bourgeois',
                'Matthew Barney',
                'Cecily Brown',
                'Banksy',
                'Shawn Bullen',
                'Lauren Clay',
                'Ygor Marini',
                'Hemali Bhuta',
                'Sam Gilliam',
                'Jason Urban',
                'Alexandra Pacula',
                'Tomasz Alen Kopera',
                'Heather Chonkel',
                'Tuba Ozkudan',
                'Neil Jenney',
                'Alphonse Mucha',
                'Artgerm',
                'Zdzisław Beksiński',
                'Beeple',
                'Takashi Murakami',
                'Greg Rutkowski',
              ]}
              id="artist"
              placeholder="Artist"
            />
            <Typeahead
              onChange={(selected) => {
                onFinishingTouchesChange(selected);
              }}
              options={[
                'highly-detailed',
                'psychedelic',
                'surrealism',
                'trending on artstation',
                'triadic color scheme',
                'smooth',
                'sharp focus',
                'matte',
                'elegant',
                'illustration',
                'digital paint',
                'dark',
                'gloomy',
                'lush',
                'octane render',
                '8k',
                '4k',
                'washed-out colors',
                'sharp',
                'dramatic lighting',
                'beautiful',
                'post-processing',
                'picture of the day',
                'ambient lighting',
                'epic composition',
                'epic fantasy',
                'polaroid',
                'cinematic',
                'masterpiece',
                'analog camera',
              ]}
              id="finishing-touches"
              placeholder="Finishing touches"
            />

            <textarea
              rows={4}
              name="prompt"
              className="prompt-box"
              value={input}
              onChange={onChange}
              placeholder={`Instructions: A ${style} type image of Bram man in the style of ${artist} with ${finishingTouches} finishing touches.`}
            />
            {/* Add your prompt button in the prompt container */}
            <div className="prompt-buttons">
              {/* Tweak classNames to change classes */}
              <a
                className={
                  isGenerating ? 'generate-button loading' : 'generate-button'
                }
                onClick={generateAction}
              >
                {/* Tweak to show a loading indicator */}
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* Add output container */}
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={input} />
            <p>{finalPrompt}</p>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://twitter.com/async_dime"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={builder} alt="builder" />
            <p>@async_dime</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
