import AsyncStorage from "@react-native-async-storage/async-storage";

// Salva ticket de um aluno
export const saveTicket = async (alunoId, ticketData) => {
  try {
    const storedTickets = await AsyncStorage.getItem("tickets");
    const tickets = storedTickets ? JSON.parse(storedTickets) : {};

    if (!tickets[alunoId]) {
      tickets[alunoId] = [];
    }

    tickets[alunoId].push(ticketData);

    await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
  } catch (error) {
    console.error("Erro ao salvar ticket:", error);
  }
};

export const getTicketsByAluno = async (alunoId) => {
  try {
    const storedTickets = await AsyncStorage.getItem("tickets");
    const tickets = storedTickets ? JSON.parse(storedTickets) : {};
    return tickets[alunoId] || [];
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return [];
  }
};

export const updateTicketsByAluno = async (alunoId, newTickets) => {
  try {
    const storedTickets = await AsyncStorage.getItem("tickets");
    let tickets = storedTickets ? JSON.parse(storedTickets) : {};

    tickets[alunoId] = newTickets;
    await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
  } catch (error) {
    console.error("Erro ao atualizar tickets:", error);
  }
}
  export const clearTicketsByAluno = async (alunoId) => {
    try {
      const storedTickets = await AsyncStorage.getItem("tickets");
      let tickets = storedTickets ? JSON.parse(storedTickets) : {};
  
      if (tickets[alunoId]) {
        delete tickets[alunoId];
        await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
      }
    } catch (error) {
      console.error("Erro ao limpar tickets:", error);
    }
  };
  export const validateTicket = async (alunoId, ticketId) => {
    try {
      const storedTickets = await AsyncStorage.getItem("tickets");
      const tickets = storedTickets ? JSON.parse(storedTickets) : {};
  
      if (!tickets[alunoId]) return [];
  
      const updatedTickets = tickets[alunoId].map(t =>
        t.id === ticketId ? { ...t, status: "indisponivel" } : t
      );
  
      tickets[alunoId] = updatedTickets;
  
      await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
  
      return updatedTickets; // retorna para atualizar o estado na tela
    } catch (error) {
      console.error("Erro ao validar ticket:", error);
      return [];
    }
  };