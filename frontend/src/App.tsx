import { Button } from "./components/ui/Button"
import { Input } from "./components/ui/Input"
import { Link } from "./components/ui/Link"

function App() {
	return (
    	<>
            <section className="container h-screen bg-background flex flex-row">
                <article className="container">
                    <h1 className="text-primary-dark text-7xl"><span className="text-primary">Plu</span>Marks</h1>
                    <img src="" alt="Feathers" width={151.7} height={439.7}/>
                    <p className="text-primary text-4xl italic">Track your Grades</p>
                </article>
                <article className="bg-surface w-1/2 rounded-4xl m-10 shadow-2xl p-4">
                    <h1 className="text-center pt-4 text-4xl italic">Welcome Back!</h1>
                    <form action="post" className="flex flex-col items-center gap-5">
                        <Input 
                            type="email"
                            placeholder="Enter your Email"
                            required={true}
                        />
                        <Input 
                            type="email"
                            placeholder="Enter your Password"
                            required={true}
                        />
                        <Link 
                            title="Forgot password?"
                            destination="#"
                        />
                        <Button placeholder="Sign In"/>
                        <p>Don't have an account?  
                            <Link 
                                title=" Sign Up Here"
                                destination="#"
                            />
                        </p>
                    </form>
                </article>
            </section>
        </>
)
}

export default App