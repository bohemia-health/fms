import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Repository() {
  return (
    <main className="mt-16 mb-16">
      <div className="grid items-center justify-center center-align gap-4">
        <h2 className="text-1xl">Lab Pro</h2>
        <h1 className="text-2xl">Research Further.</h1>
        <p>
          Not sure where to find the data you need? This is your one stop shop
          for anything numbers-related.
        </p>

        <Field orientation="horizontal">
          <ButtonGroup>
            <Input id="input-button-group" placeholder="Search..." />
            <Button>Search</Button>
          </ButtonGroup>
        </Field>
      </div>
    </main>
  );
}

{
  /* Inspiration: Hold on, I'm comin - Soul Brothers */
}
