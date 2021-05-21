URL?=http://localhost:8545

install-deps:
	@echo " > \033[32mInstalling dependencies... \033[0m "
	./scripts/install_deps.sh

.PHONY: test
test:
	@echo " > \033[32mTesting contracts... \033[0m "
	npx truffle test

start-hardhat:
	@echo " > \033[32m Starting hardhat... \033[0m "
	npx hardhat node

test-hardhat:
	@echo " > \033[32m Starting hardhat... \033[0m "
	npx hardhat test --network localhost

test-ovm:
	@echo " > \033[32mTesting contracts against OVM... \033[0m "
	npx hardhat test --network optimism

compile:
	@echo " > \033[32mCompiling contracts... \033[0m "
	npx truffle compile

compile-ovm:
	@echo " > \033[32mCompiling contracts for OVM... \033[0m "
	npx hardhat compile --network optimism

start-ganache:
	@echo " > \033[32mStarting ganache... \033[0m "
	./scripts/start_ganache.sh

start-geth:
	@echo " > \033[32mStarting geth... \033[0m "
	./scripts/geth/start_geth.sh

bindings: compile
	@echo " > \033[32mCreating go bindings for ethereum contracts... \033[0m "
	./scripts/create_bindings.sh
