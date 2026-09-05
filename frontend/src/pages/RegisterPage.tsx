import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { useRegister } from "../hooks/useRegister";

export function RegisterPage() {

    const [
        email,
        setEmail,
        errorEmail,
        password,
        setPassword,
        errorPassword,
        name,
        setName,
        age,
        setAge,
        passwordconfirmed,
        setPasswordConfirmed,
        errorPasswordConfirmed
    ] = useRegister()

        return (
        <>
            <section className="container h-screen bg-background flex flex-row">
                <article className="container">
                    <h1 className="text-primary-dark text-7xl"><span className="text-primary">Plu</span>Marks</h1>
                    <img src="" alt="Feathers" width={151.7} height={439.7}/>
                    <p className="text-primary text-4xl italic">Track your Grades</p>
                </article>
                <article className="bg-surface w-1/2 rounded-4xl m-10 shadow-2xl p-4">
                    <h1 className="text-center pt-4 text-4xl mb-8 italic">Welcome Back!</h1>
                    <form action="post" className="flex flex-col items-center gap-2">
                        <Input 
                            type="text"
                            placeholder="Enter your Full Name 'ex. John Doe'"
                            required={true}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                        <Input 
                            type="Number"
                            placeholder="Enter your Password"
                            required={true}
                            value={age}
                            onChange={(event) => setAge(Number(event.target.value))}
                        />
                        <Input 
                            type="email"
                            placeholder="Enter your Email"
                            required={true}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                            <p className="text-danger">
                                {errorEmail}
                            </p>
                        <Input 
                            type="password"
                            placeholder="Enter your Password"
                            required={true}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <p>{errorPassword}</p>
                        <Input 
                            type="password"
                            placeholder="Confirm your Password"
                            required={true}
                            value={passwordconfirmed}
                            onChange={(event) => setPasswordConfirmed(event.target.value)}
                        />
                        <p>{errorPasswordConfirmed}</p>
                        <Button placeholder="Sign In"/>
                        <p>Already have an account?  
                        <Link to="/login">Sign in Here</Link>
                        </p>
                    </form>
                </article>
            </section>
        </>
    )
}