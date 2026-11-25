# Demo_fullStack – Seller Authentication (Frontend only)

React + Vite frontend for the Seller Portal login module.
**Backend (Node.js, Express, MySQL) innum connect aagala.** So:

- Sign Up: data save aagadhu
- Sign In: real login nadakkadhu
- OTP: yaarukkum anuppa maattanga, verify-um aagadhu
- Reset Password: edhuvum update aagadhu

Ellame frontend validation + UI flow mattum.

## Run panra vazhi (unga computer-la)

1. Zip-ah extract pannunga. **Unga existing files-ah overwrite panna vendaam**: extract pannum bothu "Replace?" nu kettaa, mudhalla compare pannunga.
2. Terminal open panni:

```
cd C:\Users\murug\OneDrive\Desktop\Demo_fullStack
npm install
npm run dev
```

- `cd ...` : project folder-kku ulla pogum
- `npm install` : package.json-la irukkura libraries (react, vite, react-router-dom) download pannum. `node_modules` folder create aagum
- `npm run dev` : Vite development server start pannum. Terminal-la kaattura link (usually http://localhost:5173) browser-la open pannunga

## Folder structure

```
Demo_fullStack/
├── index.html                 -> Vite-oda entry HTML (main.jsx-ah load pannum)
├── package.json               -> project name, scripts, dependencies
├── vite.config.js             -> Vite + React plugin setting
└── src/
    ├── main.jsx               -> React-ah start pannum, BrowserRouter wrap pannum
    ├── App.jsx                -> Routes (/ -> /login redirect, /login = SellerAuth, /seller/dashboard = placeholder)
    ├── index.css              -> global styles
    └── pages/seller/
        ├── SellerAuth.jsx     -> 5 forms, validation, logic
        └── SellerAuth.css     -> full design
```

## SellerAuth.jsx eppadi velai seiyudhu

- `const [view, setView] = useState("signin")` : edhu form kaattanum-nu decide pannum. Values: `signin`, `signup`, `forgot`, `otp`, `reset`
- `{view === "signin" && (<form>...</form>)}` : appo irukkura view-kku mattum form render aagum. So oru neram-la oru form mattum, same idathula
- Controlled inputs: `value={values.email}` + `onChange={handleChange}`. React state thaan input-oda "truth"
- `onSubmit` + `e.preventDefault()` : page reload aagama thadukkum, apram namma validation run pannum
- `validate()` function : required, email format, password min 8, confirm match, mobile 10 digits (6-9 la start) check pannum
- `goTo(nextView, notice)` : form maathum, errors clear pannum, message kaattum
- `Field` component : label + icon + input + error ellam reuse panna

## Frontend flow

Sign In -> (Sign Up) -> validation OK -> Sign In (message-oda)
Sign In -> Forgot Password -> Send OTP -> OTP form -> Verify OTP -> Reset Password -> Sign In

OTP demo-la: edhavadhu 6 digits kodutha pothum (verify nadakkadhu).

## Aduthu (backend)

Node.js + Express + MySQL: password hashing (bcrypt), JWT login, real OTP email/SMS, reset token. Adhukku apram `/seller/dashboard` route-ah protect pannalam.
