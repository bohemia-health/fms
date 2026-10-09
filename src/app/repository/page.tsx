import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SetBreadcrumb from "@/components/footer/breadcrumb/SetBreadcrumb";
import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import { container } from "@/lib/layout";

export default function Repository() {
  return (
    <main className={container}>
      <div className="grid justify-items-start gap-4">
        <h2 className="text-1xl">Lab Pro</h2>
        <h1 className="text-2xl">Research Further.</h1>
        <p>
          Not sure where to find the data you need? This is your one stop shop
          for anything numbers-related.
        </p>

        <h1 className="text-2xl">Research Further.</h1>
        <p>
          Not sure where to find the data you need? This is your one stop shop
          for anything numbers-related.
        </p>

        <h1 className="text-2xl">Research Further.</h1>
        <p>
          Not sure where to find the data you need? This is your one stop shop
          for anything numbers-related.
        </p>
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
      <SetBreadcrumb items={[{ label: "Repository" }]} />
      <SetFootnotes
        notes={[
          "Lab reports are provided by independent third-party laboratories and reflect the batch tested, not every unit sold.",
        ]}
      />
    </main>
  );
}

{
  /* Inspiration: Hold on, I'm comin - Soul Brothers */
}
