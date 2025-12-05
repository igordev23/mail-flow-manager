# 📘 MVVM Rules — Guia Oficial do Projeto

Este documento estabelece as regras, princípios e diretrizes para o uso correto do padrão **MVVM (Model–View–ViewModel)** neste projeto em **React Native + TypeScript + Expo Router**.

---

# 📐 1. Conceitos Fundamentais do MVVM

## 🔹 Model
- Contém entidades, regras de negócio, serviços e repositórios.
- Representa o domínio puro da aplicação.
- Não depende da interface nem de bibliotecas externas.

Exemplos:
- `entities/User.ts`
- `services/AuthService.ts`

## 🔹 ViewModel
- Gerencia estados e ações.
- Atua como ponte entre Model e View.
- Não deve conter UI.
- Implementada como Custom Hooks.

Exposição obrigatória:
- **state** → dados prontos para renderização  
- **actions** → funções chamadas pela View

## 🔹 View
- Interface visual consumida pelo usuário.
- Apenas renderiza dados da ViewModel.
- Não contém lógica de negócio.

---

# 🧱 2. Estrutura de Pastas Oficial

```bash
src/
├─ app/
│ ├─ _layout.tsx
│ ├─ index.tsx
│ └─ home.tsx
│
├─ model/
│ ├─ entities/
│ ├─ repositories/
│ └─ services/
│
├─ viewmodel/
│ └─ useLoginViewModel.ts
│
├─ view/
│ ├─ components/
│ └─ LoginView.tsx
|- useCase/
│ ├─ LoginUseCase.ts
│ └─ RegisterUseCase.ts
|- infrastructure/
│ ├─ EmailServiceMaligun.ts
│ └─ IBGELocationService.ts
│
└─ __tests__/   ← pasta de testes obrigatória

```


---

# 🔧 3. Regras Gerais

## ✔ 3.1 Model
- Apenas lógica de domínio.
- Sem JSX ou imports de UI.
- Regras de negócio permanecem aqui.

## ✔ 3.2 ViewModel
- Sempre como Custom Hook (`useXxxViewModel`).
- Pode usar `useState`, `useEffect`, `useCallback`.
- Sem lógica visual.
- Não acessa elementos da View diretamente.
- Sempre usar type useXxxViewModelState para o estado quando nescessario.
- Sempre usar type useXxxViewModelActions para as ações Quando nescessario.
Deve retornar:
```ts
return {
  state: { ... },
  actions: { ... }
}
```

## ✔ 3.3 View


Apenas interface visual.


Usa estado da ViewModel.


Chama ações da ViewModel.


Pode ter estados visuais (ex.: texto de input).

sempre use o gluestack ui com tailwindcss para criar os componentes visuais.



## 📡 4. Fluxo de Comunicação
Usuário → View → Actions → ViewModel → Model
                        ↑        ↓
                Estado pronto ←—

A View nunca fala diretamente com o Model.

## 📏 5. Padrões de Nomeação


Views: PascalCase → LoginView.tsx


ViewModels: camelCase → useLoginViewModel.ts


Models/Entities: PascalCase → User.ts


Pastas: camelCase



## 6. Boas Práticas Obrigatórias


Arquivos pequenos e coesos.


Lógica complexa sempre no Model.


ViewModel com no máximo ~150 linhas.


Views limpas e declarativas.


Componentes reutilizáveis em view/components.


Criar theme.ts para cores, fontes e espaçamentos.



## 🧪 6. 
### 6.1 Testes São Obrigatórios Para:
#### 1. ViewModels

Testar regras de negócio

Testar estados gerados

Testar chamadas de ações

Testar comportamento de erro

#### 2. Serviços e Repositórios

Sempre acessados via interfaces (DI):

ITaskRepository

ITaskService

Devem ser mockáveis e substituíveis.

#### 3. CRUD (Obrigatório)


#### 4. Armazenamento em Memória  

Para testes, o repositório deve ser implementado em memória:

model/repositories/memory/TaskRepositoryMemory.ts

### 7.2 Estrutura Recomendada dos Testes
```bash
src/
└─ __tests__/
   ├─ viewmodel/
   │   ├─ useTaskViewModel.test.ts
   │   └─ ConverterViewModel.test.ts
   ├─ model/
   │   └─ TaskRepositoryMemory.test.ts
   └─ samples/
       └─ fakeServices/
           └─ FakeExchangeRateService.ts
```

### 7.3 Regras de Testes  
#### 1. Testes Não Devem Renderizar UI (View)

Views não são testadas

Apenas lógica (Model / ViewModel)

#### 2. Testes Devem Simular Serviços (DI)

Exemplo:
```ts
class FakeTaskRepository implements ITaskRepository {
  constructor(private tasks: Task[] = []) {}

  async list() { return [...this.tasks]; }
  async create(task) { this.tasks.push(task); return task; }
  async update(id, data) { /* ... */ }
  async delete(id) { /* ... */ }
}
```

#### 3. Testes de ViewModel Devem:

Observar mudanças de estado

Validar loading, errors, dados e ações

Usar subscribe() OU ler snapshot

#### 4. Exemplo Oficial — Teste de ViewModel

O exemplo abaixo está alinhado às suas regras e ao recebimento de DI:
```ts
import { ConverterViewModel } from './ConverterViewModel';
import { IExchangeRateService } from '../domain/IExchangeRateService';

class FakeService implements IExchangeRateService {
  constructor(private readonly rate: number, private readonly shouldFail = false) {}
  async getRate(base: string, target: string) {
    if (this.shouldFail) throw new Error('Falha simulada');
    return { base, target, rate: this.rate };
  }
}

describe('ConverterViewModel', () => {
  test('converte 100 BRL para USD usando taxa mockada', async () => {
    const vm = new ConverterViewModel(new FakeService(0.2));
    const states: any[] = [];
    vm.subscribe((s) => states.push({ ...s }));

    vm.setAmountBRL(100);
    await vm.convert();

    const last = vm.snapshot;
    expect(last.rate).toBe(0.2);
    expect(last.amountUSD).toBe(20);
    expect(states.some((s) => s.loading === true)).toBeTruthy();
    expect(last.loading).toBe(false);
  });

  test('propaga erro do serviço e desliga loading', async () => {
    const vm = new ConverterViewModel(new FakeService(0.2, true));
    vm.setAmountBRL(50);
    await vm.convert();

    const last = vm.snapshot;
    expect(last.error).toBe('Falha simulada');
    expect(last.loading).toBe(false);
    expect(last.amountUSD).toBeUndefined();
  });
});
```


## 🚀 8. Evolução Futura (MVVM Avançado)


Model 100% puro e independente.


Infraestrutura separada para acesso a APIs e banco local.


ViewModel desacoplada sem dependência de React.


Repositórios com interfaces.



## 9. Checklist Antes de Subir PR


 A ViewModel é um hook?


 A View não tem regra de negócio?


 Model não contém UI?


 ViewModel retorna apenas estado e ações?


 Componentes visuais estão em /view/components?


 Nomes seguem o padrão?


 Lógica de domínio está dentro do Model?



## 📚 10. Considerações Finais
Este documento serve como referência permanente para desenvolvimento no padrão MVVM Simplificado aplicado ao React Native com TypeScript e Expo Router.

---

