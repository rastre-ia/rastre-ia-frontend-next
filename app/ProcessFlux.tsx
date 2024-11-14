import { FunctionComponent } from "react";
import {
  Shield,
  Search,
  FileText,
  MessageSquare,
  Database,
  UserCheck,
  BadgeIcon as Police,
} from "lucide-react";

interface ProcessStepProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="bg-primary text-primary-foreground p-2 rounded-full">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

interface ProcessFluxProps {}

const ProcessFlux: FunctionComponent<ProcessFluxProps> = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-12 text-center">
        Fluxo de processo RastreIA
      </h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold mb-4">
            Registro de Itens Roubados
          </h3>
          <ProcessStep
            icon={Shield}
            title="Registrar Item Roubado"
            description="Envie fotos e informações detalhadas do item roubado."
          />
          <ProcessStep
            icon={Database}
            title="Processamento de IA"
            description="A IA analisa imagens e dados e correlaciona no banco de dados."
          />
          <ProcessStep
            icon={UserCheck}
            title="Assistência da Comunidade"
            description="A polícia pode solicitar ajuda de usuários próximos para auxiliar na resolução do seu caso."
          />
          <ProcessStep
            icon={Police}
            title="Resolução de Casos"
            description="Autoridades utilizam dados coletados para investigação."
          />
        </div>
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold mb-4">Envio de Denúncia</h3>
          <ProcessStep
            icon={MessageSquare}
            title="Enviar Denúncia"
            description="Utilize o chat de IA para detalhar atividades suspeitas."
          />
          <ProcessStep
            icon={FileText}
            title="Extração de Informações"
            description="A IA extrai dados importantes para estruturar o caso."
          />
          <ProcessStep
            icon={Database}
            title="Integração ao Banco de Dados"
            description="O caso é adicionado ao banco de dados com possíveis correlações."
          />
          <ProcessStep
            icon={Search}
            title="Reconhecimento de Padrões"
            description="É realizada uma análise de padrões entre denúncias de diversos usuários para resolver casos complexos."
          />
        </div>
      </div>
    </section>
  );
};

export default ProcessFlux;
