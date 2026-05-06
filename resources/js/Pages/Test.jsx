import Button from '../Components/atoms/Button.jsx';
import Layout from "../Template/LayaoutNav.jsx";
export default function Test() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Test Atomic Design</h1>

      <Button variant="primary">
        Primary Button
      </Button>

      <Button variant="secondary">
        Secondary Button
      </Button>

        <Layout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </Layout>
    </div>
  )
}