.PHONY: run clean

# Porta em que o servidor será iniciado (pode ser alterada)
PORT = 8000

run:
	@echo "Iniciando o servidor HTTP na porta $(PORT)..."
	python3 -m http.server $(PORT)

clean:
	@echo "Não há arquivos para limpar neste projeto."
