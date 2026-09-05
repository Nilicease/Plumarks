import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { useLogin } from "../hooks/useLogin";

export function LoginPage() {

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        await login();
    }

    const [
        email,
        setEmail,
        password,
        setPassword,
        error,
        login
    ] = useLogin()

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
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-1">
                        <Input 
                            type="email"
                            placeholder="Enter your Email"
                            required={true}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                            <p className="text-danger">
                                {error}
                            </p>
                        <Input 
                            type="password"
                            placeholder="Enter your Password"
                            required={true}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <Button placeholder="Sign In"/>
                        <p>Don't have an account?  
                        <Link to="/register">Sign up here</Link>
                        </p>
                    </form>
                </article>
            </section>
        </>
    )
}