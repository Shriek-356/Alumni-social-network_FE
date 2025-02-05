import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native"; 
import { getAllPostSurvey } from "../../configs/API/PostSurveyApi";
import { getToken } from "../../configs/api";

const StatsPostSurvey = () => {
    const [loading, setLoading] = useState(true);
    const [topQuestions, setTopQuestions] = useState([]);
    const [token, setToken] = useState(); // State để lưu token
  
    // Lấy token khi component được mount
    useEffect(() => {
      const fetchToken = async () => {
        const userToken = await getToken();
        setToken(userToken); // Lưu token vào state
      };
      fetchToken();
    }, []);
  
    // Lấy dữ liệu khi đã có token
    useEffect(() => {
      const fetchData = async () => {
        if (!token) return; // Chờ token sẵn sàng
  
        try {
          const data = await getAllPostSurvey(token);
  
          // Xử lý dữ liệu
          let questionStats = [];
          data.results.forEach((survey) => {
            survey.survey_questions.forEach((question) => {
              questionStats.push({
                id: question.id,
                question_content: question.question_content,
                created_date: question.created_date,
                answer_count: question.survey_answers.length,
                answers: question.survey_answers.map((answer) => answer.answer_value),
              });
            });
          });
  
          // Sắp xếp theo số lượng câu trả lời giảm dần
          questionStats.sort((a, b) => b.answer_count - a.answer_count);
  
          // Gắn icon sao
          questionStats = questionStats.map((question, index) => ({
            ...question,
            star_icon: index === 0 ? "⭐⭐⭐⭐⭐" : index === 1 ? "⭐⭐⭐⭐" : index === 2 ? "⭐⭐⭐" : null,
          }));
  
          // Lấy top 3 câu hỏi
          setTopQuestions(questionStats.slice(0, 3));
        } catch (error) {
          console.error("Error fetching survey stats:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [token]); // Chỉ gọi API khi token sẵn sàng
  
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }
    return (
        <View style={styles.container}>
          <Text style={styles.header}>Top 3 Câu Hỏi Được Quan Tâm Nhất</Text>
          <FlatList
            data={topQuestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.star}>{item.star_icon}</Text>
                <Text style={styles.question}>{item.question_content}</Text>
                <Text style={styles.date}>Ngày tạo: {item.created_date}</Text>
                <Text style={styles.answers}>
                  Câu trả lời: {item.answers.join(", ") || "Không có câu trả lời"}
                </Text>
                <Text style={styles.answerCount}>
                  Tổng số câu trả lời: {item.answer_count}
                </Text>
              </View>
            )}
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingLeft: 16,
        paddingTop:50,
        paddingBottom:16,
        paddingRight:16,
      },
      header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
        color: "#333",
      },
      card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      },
      star: {
        fontSize: 18,
        color: "#FFD700",
        marginBottom: 8,
        textAlign: "center",
      },
      question: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
      },
      date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
      },
      answers: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
      },
      answerCount: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: "bold",
      },
      loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    });
    
    export default StatsPostSurvey;