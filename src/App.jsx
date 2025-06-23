import { useCallback, useState, useEffect, useRef } from 'react';

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharacterAllowed] = useState(false);
  const [pronounceable, setPronounceable] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState('Weak');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const passwordRef = useRef(null);

  const generatePronounceable = (len) => {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    let pass = '';
    for (let i = 0; i < len; i++) {
      pass += i % 2 === 0
        ? consonants.charAt(Math.floor(Math.random() * consonants.length))
        : vowels.charAt(Math.floor(Math.random() * vowels.length));
    }
    return pass;
  };

  const passwordGenerator = useCallback(() => {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let pass = '';

    if (pronounceable) {
      pass = generatePronounceable(length);
    } else {
      if (numberAllowed) str += '0123456789';
      if (characterAllowed) str += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
      for (let i = 1; i <= length; i++) {
        const charIndex = Math.floor(Math.random() * str.length);
        pass += str.charAt(charIndex);
      }
    }

    setPassword(pass);
  }, [length, numberAllowed, characterAllowed, pronounceable]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, password.length);
    window.navigator.clipboard.writeText(password);
    setCopied(true);

    // Expire clipboard after 5s
    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 5000);

    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const checkStrength = useCallback(() => {
    let score = 0;
    if (length > 8) score++;
    if (numberAllowed) score++;
    if (characterAllowed) score++;
    if (pronounceable) score--;

    if (score <= 1) setStrength('Weak');
    else if (score === 2) setStrength('Medium');
    else setStrength('Strong');
  }, [length, numberAllowed, characterAllowed, pronounceable]);

  useEffect(() => {
    passwordGenerator();
    checkStrength();
  }, [length, numberAllowed, characterAllowed, pronounceable, passwordGenerator, checkStrength]);

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-500`}>
      
      {/* Header / Branding Section */}
      <div className="text-center py-8">
        {/* Optional logo image */}
        {/* <img src="/logo.png" alt="Logo" className="mx-auto w-20 h-20 mb-2 rounded-full" /> */}
        <h1 className="text-4xl font-bold tracking-tight">🔐 SecurePass</h1>
        <p className="text-lg font-medium text-gray-400 dark:text-gray-300">Smart, Strong, and Stylish Password Generator</p>
      </div>

      {/* Main Card */}
      <div className="mt-6 w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-6 bg-white dark:bg-zinc-900 transition text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Password Generator</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            className={`outline-none w-full py-2 px-3 ${darkMode ? 'text-black' : 'text-gray-700'}`}
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
          <button
            onClick={copyPasswordToClipboard}
            className="bg-blue-700 hover:bg-sky-600 text-white px-3"
          >
            {copied ? '✅ Copied' : 'Copy'}
          </button>
        </div>

        {/* Password Strength Indicator */}
        <div className="mb-4">
          <div className="text-sm mb-1">
            Strength:{" "}
            <span
              className={`font-semibold ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-400"
                  : "text-green-500"
              }`}
            >
              {strength}
            </span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                strength === "Weak"
                  ? "bg-red-500 w-1/3"
                  : strength === "Medium"
                  ? "bg-yellow-400 w-2/3"
                  : "bg-green-500 w-full"
              }`}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-y-3 text-sm text-black">
          <div className="flex items-center gap-x-2">
            <input
              type="range"
              min={5}
              max={20}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="cursor-pointer"
            />
            <label>Length: {length}</label>
          </div>

          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              id="numberInput"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
              className="cursor-pointer"
            />
            <label htmlFor="numberInput">Include Numbers</label>
          </div>

          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              id="characterInput"
              checked={characterAllowed}
              onChange={() => setCharacterAllowed((prev) => !prev)}
              className="cursor-pointer"
            />
            <label htmlFor="characterInput">Include Symbols</label>
          </div>

          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              id="pronounceableInput"
              checked={pronounceable}
              onChange={() => setPronounceable((prev) => !prev)}
              className="cursor-pointer"
            />
            <label htmlFor="pronounceableInput">Easy-to-Remember (Pronounceable)</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
