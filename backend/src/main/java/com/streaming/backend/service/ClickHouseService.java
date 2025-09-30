package com.streaming.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;

@Service
public class ClickHouseService {

    @Value("${clickhouse.url}")
    private String clickHouseUrl;

    @Value("${clickhouse.username:default}")
    private String username;

    @Value("${clickhouse.password:}")
    private String password;

    private static final String INSERT_SQL =
            "INSERT INTO crypto_db.crypto_prices (symbol, price, timestamp) VALUES (?, ?, ?)";

    public void savePrice(String symbol, Double price, LocalDateTime timestamp) {
        try (Connection connection = DriverManager.getConnection(clickHouseUrl, username, password);
             PreparedStatement statement = connection.prepareStatement(INSERT_SQL)) {

            statement.setString(1, symbol);
            statement.setDouble(2, price);
            statement.setObject(3, timestamp); // works with LocalDateTime
            statement.executeUpdate();

        } catch (SQLException e) {
            System.err.println("❌ Failed to insert into ClickHouse: " + e.getMessage());
        }
    }
}
