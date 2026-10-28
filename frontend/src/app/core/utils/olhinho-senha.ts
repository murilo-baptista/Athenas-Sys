/**
 * Coloca o "olhinho" (mostrar/ocultar) em TODOS os campos de senha e de código
 * (input type="password") do sistema, inclusive nas telas que forem criadas
 * depois. Não precisa mexer em cada tela: basta chamar ativarOlhinhoSenha()
 * uma vez, no componente raiz.
 */

const ICONE_OLHO =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';

const ICONE_OLHO_CORTADO =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M17.9 17.9A10.9 10.9 0 0 1 12 19C5.5 19 1.5 12 1.5 12a19.6 19.6 0 0 1 5-5.7"/>' +
  '<path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10.5 7 10.5 7a19.7 19.7 0 0 1-2.7 3.7"/>' +
  '<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M1 1l22 22"/></svg>';

const MARCA = 'data-olhinho';
const envoltorios = new WeakMap<HTMLInputElement, HTMLElement>();

function decorar(input: HTMLInputElement): void {
  if (input.hasAttribute(MARCA) || !input.parentElement) return;
  input.setAttribute(MARCA, '1');

  const pai = input.parentElement;
  const paiEhFlex = getComputedStyle(pai).display.includes('flex');

  const envoltorio = document.createElement('span');
  envoltorio.className = 'olhinho-wrap' + (paiEhFlex ? ' olhinho-flex' : '');
  pai.insertBefore(envoltorio, input);
  envoltorio.appendChild(input);
  envoltorios.set(input, envoltorio);

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'olhinho-btn';
  botao.setAttribute('aria-label', 'Mostrar senha');
  botao.innerHTML = ICONE_OLHO;
  botao.addEventListener('click', () => {
    const vaiMostrar = input.type === 'password';
    input.type = vaiMostrar ? 'text' : 'password';
    botao.innerHTML = vaiMostrar ? ICONE_OLHO_CORTADO : ICONE_OLHO;
    botao.setAttribute('aria-label', vaiMostrar ? 'Ocultar senha' : 'Mostrar senha');
  });
  envoltorio.appendChild(botao);
}

function varrer(raiz: ParentNode): void {
  raiz.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach(decorar);
}

/** Se o Angular removeu o campo (ex.: *ngIf), remove também o envoltório com o olhinho. */
function limpar(no: Node): void {
  const inputs: HTMLInputElement[] = [];
  if (no instanceof HTMLInputElement) inputs.push(no);
  else if (no instanceof HTMLElement) no.querySelectorAll<HTMLInputElement>('input[' + MARCA + ']').forEach(i => inputs.push(i));

  for (const input of inputs) {
    const envoltorio = envoltorios.get(input);
    if (envoltorio && !(input.isConnected && input.parentElement === envoltorio)) {
      envoltorio.remove();
      envoltorios.delete(input);
    }
  }
}

export function ativarOlhinhoSenha(): void {
  if (typeof document === 'undefined') return;

  varrer(document);

  new MutationObserver(registros => {
    for (const registro of registros) {
      registro.addedNodes.forEach(no => {
        if (no instanceof HTMLInputElement && no.type === 'password') decorar(no);
        else if (no instanceof HTMLElement) varrer(no);
      });
      registro.removedNodes.forEach(limpar);
    }
  }).observe(document.body, { childList: true, subtree: true });
}