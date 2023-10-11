function mask_int(e){
    let input = e.target;
    let int = input.value.replace(/[^\d]/g, ''); // Remove digitos não inteiros
    input.value = int;
}

function mask_ip(e){
    let input = e.target;
    let int = input.value.replace(/[^\d:.]/g, ''); // Remove digitos não inteiros exceto '.' ou ':'
    input.value = int;
}

function mask_rg(e){
    let input = e.target;
    let rg = input.value.replace(/[^\dxX]/g, ''); // Remove digitos não inteiros exceto 'x' ou 'X'
    rg = rg.replace(/^(\d{2})(\d)/g, '$1.$2'); // Formata os primeiros 2 digitos com '.'
    rg = rg.replace(/^(\d{2})\.(\d{3})(\d)/g, '$1.$2.$3'); // Formata do 3º ao 5º digito com '.'
    rg = rg.replace(/^(\d{2})\.(\d{3})\.(\d{3})([\da-zA-Z])?$/g, '$1.$2.$3-$4'); // Formata do 6º ao 9º digito com '.' e adiciona '-', além de aceitar x como o ultimo digito
    
    if(e.inputType === "deleteContentBackward" && rg.charAt(rg.length- 1) === "-"){
        // Remove o caracter "-" e faz update no valor do input
        input.value = rg.replace(/-\s*$/, "");
    }else{
        // Faz update no valor do input
        input.value = rg;
    }
}

function mask_cpf(e){
    let input = e.target;
    let cpf = input.value.replace(/[^\d]/g, ''); // Remove digitos não inteiros
    cpf = cpf.replace(/^(\d{3})(\d)/g, '$1.$2'); // Formata os primeiros 3 digitos com '.'
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3'); // Formata do 4º ao 6º digito com '.'
    cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4'); // Formata do 7º ao 9º digito com '.'
    cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{2})?$/g, '$1.$2.$3-$4'); // Formata do 9º ao 11º digito com '-'
        
    if(e.inputType === "deleteContentBackward" && cpf.charAt(cpf.length- 1) === "-"){
        // Remove o caracter "-" e faz update no valor do input
        input.value = cpf.replace(/-\s*$/, "");
    }else{
        // Faz update no valor do input
        input.value = cpf;
    }
}

function mask_cnpj(e){
    let input = e.target;
    let cnpj = input.value.replace(/[^\d]/g, ''); // Remove digitos não inteiros
    cnpj = cnpj.replace(/^(\d{2})(\d)/g, '$1.$2'); // Formata os primeiros 2 digitos com '.'
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/g, '$1.$2.$3') // Formata do 3º ao 5º digito com '.'
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3/$4'); // Formata do 6º ao 8º digito com '/'
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/?(\d)/g, '$1.$2.$3/$4'); // Formata do 9º ao 12º digito com
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/?(\d{4})(\d)?$/g, '$1.$2.$3/$4-$5'); // Formata do 12º ao 14º digito com '-'
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/?(\d{4})\-?(\d{2})?$/g, '$1.$2.$3/$4-$5'); // Formata do 12º ao 14º digito com '-'
        
    if(e.inputType === "deleteContentBackward" && cnpj.charAt(cnpj.length- 1) === "-"){
        // Remove o caracter "-" e faz update no valor do input
        input.value = cnpj.replace(/-\s*$/, "");
    }else{
        // Faz update no valor do input
        input.value = cnpj;
    }
}