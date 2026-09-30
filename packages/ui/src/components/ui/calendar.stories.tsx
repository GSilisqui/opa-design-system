import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Calendar, type DateRange } from "./calendar";

const meta = {
  title: "Componentes/Calendar",
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: https://www.figma.com/design/UW4As1KdSaPboQ3sNMAbCi?node-id=56-269 · Shadcn Calendar (react-day-picker), pt-BR por padrão. Dia selecionado em primary; período com extremos em primary e meio em primary-subtle; hoje com um ponto. Normalmente usado dentro de DatePicker/DateRangePicker; standalone quando o calendário fica sempre visível.",
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DataUnica: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 12));
    return (
      <div className="w-fit rounded-xl border border-border">
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const Periodo: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2025, 0, 8), to: new Date(2025, 0, 16) });
    return (
      <div className="w-fit rounded-xl border border-border">
        <Calendar mode="range" defaultMonth={new Date(2025, 0, 1)} selected={range} onSelect={setRange} />
      </div>
    );
  },
};

export const DiasDesabilitados: Story = {
  render: () => (
    <div className="w-fit rounded-xl border border-border">
      <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} disabled={{ before: new Date(2025, 0, 10) }} selected={new Date(2025, 0, 14)} />
    </div>
  ),
};
