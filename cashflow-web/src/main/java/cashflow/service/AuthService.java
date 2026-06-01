package cashflow.service;

import cashflow.dao.UserRepository;
import cashflow.model.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(Long id) {
        return userRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
    }
}