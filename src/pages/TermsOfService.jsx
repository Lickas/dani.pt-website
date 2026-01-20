import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#111]">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-[#222]">
                <div className="container-site py-12">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E60000] mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Voltar ao início
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E60000] rounded-sm flex items-center justify-center">
                            <FileText className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white">
                                Termos de Serviço
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Última atualização: Janeiro 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-site py-12 md:py-16">
                <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
                    
                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            1. Aceitação dos Termos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Ao aceder e utilizar o website dANI.PT, concorda em ficar vinculado a estes Termos de Serviço. 
                            Se não concordar com qualquer parte destes termos, não deverá utilizar o meu website.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            2. Descrição do Serviço
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            A dANI.PT é um stand automóvel que oferece serviços de venda de veículos usados e seminovos. 
                            O meu website permite:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
                            <li>• Visualizar o meu catálogo de viaturas disponíveis</li>
                            <li>• Obter informações detalhadas sobre cada veículo</li>
                            <li>• Entrar em contacto comigo para mais informações</li>
                            <li>• Subscrever a minha newsletter para receber novidades</li>
                            <li>• Consultar campanhas e promoções em vigor</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            3. Informação dos Veículos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Esforçamo-nos por manter as informações dos veículos atualizadas e precisas. No entanto:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
                            <li>• Os preços apresentados são indicativos e podem sofrer alterações</li>
                            <li>• As fotografias são meramente ilustrativas</li>
                            <li>• A disponibilidade dos veículos está sujeita a venda prévia</li>
                            <li>• As especificações técnicas devem ser confirmadas presencialmente</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            4. Utilização do Website
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Ao utilizar o meu website, compromete-se a:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
                            <li>• Fornecer informações verdadeiras nos formulários de contacto</li>
                            <li>• Não utilizar o website para fins ilegais ou não autorizados</li>
                            <li>• Não tentar aceder a áreas restritas do website</li>
                            <li>• Não interferir com o funcionamento normal do website</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            5. Propriedade Intelectual
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Todo o conteúdo presente no website dANI.PT, incluindo textos, imagens, logótipos, 
                            e design, é propriedade da dANI.PT ou dos seus licenciadores e está protegido por 
                            direitos de autor e outras leis de propriedade intelectual.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            6. Limitação de Responsabilidade
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            A dANI.PT não se responsabiliza por:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
                            <li>• Erros ou omissões nas informações do website</li>
                            <li>• Interrupções no funcionamento do website</li>
                            <li>• Danos resultantes da utilização ou impossibilidade de utilização do website</li>
                            <li>• Conteúdo de websites externos para os quais possamos ter links</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            7. Alterações aos Termos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. 
                            As alterações entram em vigor imediatamente após a sua publicação no website. 
                            A continuação da utilização do website após as alterações constitui a aceitação dos novos termos.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            8. Lei Aplicável
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Estes Termos de Serviço são regidos pela lei portuguesa. Qualquer litígio 
                            será submetido aos tribunais competentes de Portugal.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            9. Contacto
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Para questões relacionadas com estes Termos de Serviço, contacte-nos através:
                        </p>
                        <div className="mt-4 p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-sm">
                            <p className="text-gray-900 dark:text-white font-medium">dANI.PT - Stand Automóvel</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Email: rgpd@leandroxws.dev</p>
                            <p className="text-gray-600 dark:text-gray-400">Telefone: +351 919 190 993</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
